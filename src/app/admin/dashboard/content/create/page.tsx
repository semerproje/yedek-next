'use client'

import React, { useState, useEffect, useRef, useCallback } from "react";
import { collection, getDocs, query, orderBy, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import CropDialog from "@/components/CropDialog";

// Sosyal medya boyutları
const SOCIAL_MEDIA_SIZES = {
  facebook: { w: 1200, h: 630 },
  twitter: { w: 1200, h: 675 },
  instagram: { w: 1080, h: 1080 },
  linkedin: { w: 1200, h: 627 },
  whatsapp: { w: 1080, h: 1080 }
};

// Görsel kırpma fonksiyonu
async function getCroppedImg(imageSrc: string, croppedAreaPixels: any, width = 1080, height = 1080) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context bulunamadı");
      
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        width,
        height
      );
      canvas.toBlob((blob) => {
        if (!blob) return reject("Blob oluşturulamadı");
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = (e) => reject(e);
  });
}

// AI demo haber içeriği
async function aiGenerateContent(headline: string) {
  await new Promise(r => setTimeout(r, 1200));
  return `
    <p><b>${headline}</b> başlıklı haberin detayları:</p>
    <ul>
      <li>Bu içerik yapay zeka tarafından otomatik olarak üretildi.</li>
      <li>Başlıkla alakalı güncel gelişmeler, analizler ve yorumlar burada yer alacak.</li>
      <li>Kullanıcı editörüyle düzenlenebilir ve zenginleştirilebilir.</li>
    </ul>
    <p>Otomatik üretim demo modundadır.</p>
  `;
}

interface FormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  priority: string;
  breaking: boolean;
  urgent: boolean;
  status: string;
  author: string;
  source: string;
  sourceUrl: string;
  youtube: string;
}

interface ImageData {
  id: number;
  file?: File;
  url: string;
  caption: string;
  alt: string;
}

interface VideoData {
  id: number;
  file?: File;
  url: string;
  title: string;
  description: string;
  embedUrl?: string;
}

interface CropModal {
  open: boolean;
  imageIdx: number | null;
  platform: string | null;
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  imageUrl: string;
  loading: boolean;
}

export default function CreateNewsPage() {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    title: "",
    summary: "",
    content: "",
    category: "gundem",
    tags: [],
    priority: "normal",
    breaking: false,
    urgent: false,
    status: "draft",
    author: "",
    source: "Manuel",
    sourceUrl: "",
    youtube: ""
  });

  const [autoSummary, setAutoSummary] = useState(true);
  const [images, setImages] = useState<ImageData[]>([]);
  const [imageVariants, setImageVariants] = useState<any>({});
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Sosyal medya ve önceki haberler
  const [sharePlatforms, setSharePlatforms] = useState<string[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [prevNewsMode, setPrevNewsMode] = useState("auto");
  const [selectedPrevNews, setSelectedPrevNews] = useState<string[]>([]);
  const [autoPrevNewsCount, setAutoPrevNewsCount] = useState(3);
  const [fetchingNews, setFetchingNews] = useState(false);

  // Crop modal
  const [cropModal, setCropModal] = useState<CropModal>({
    open: false,
    imageIdx: null,
    platform: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 1,
    imageUrl: "",
    loading: false,
  });

  const categories = [
    'gundem', 'ekonomi', 'spor', 'teknoloji', 'saglik', 
    'kultur', 'dunya', 'magazin', 'cevre', 'politika', 'egitim', 'din'
  ];

  // Firestore'dan son 20 haberi çek
  useEffect(() => {
    setFetchingNews(true);
    getDocs(query(collection(db, "news"), orderBy("createdAt", "desc"), limit(20)))
      .then(snapshot => {
        setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
      .catch(console.error)
      .finally(() => setFetchingNews(false));
  }, []);

  // İçerik değiştikçe otomatik özet oluştur
  useEffect(() => {
    if (autoSummary) {
      const plain = form.content.replace(/<[^>]+>/g, " ");
      setForm(prev => ({ ...prev, summary: plain.slice(0, 200) }));
    }
  }, [form.content, autoSummary]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Görsel Yükleme
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const newImage: ImageData = {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target?.result as string,
            caption: '',
            alt: file.name.split('.')[0]
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    if (e.target) e.target.value = '';
  };

  // Video Yükleme
  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file: File) => {
      if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const newVideo: VideoData = {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target?.result as string,
            title: file.name.split('.')[0],
            description: ''
          };
          setVideos(prev => [...prev, newVideo]);
        };
        reader.readAsDataURL(file);
      }
    });
    if (e.target) e.target.value = '';
  };

  // Crop Modal Aç
  const openCropModal = (idx: number, platform: string) => {
    setCropModal({
      open: true,
      imageIdx: idx,
      platform: platform,
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: platform !== "whatsapp" ? SOCIAL_MEDIA_SIZES[platform as keyof typeof SOCIAL_MEDIA_SIZES]?.w / SOCIAL_MEDIA_SIZES[platform as keyof typeof SOCIAL_MEDIA_SIZES]?.h : 1,
      imageUrl: images[idx]?.url,
      loading: false,
    });
  };

  // Crop İşlemi Kaydet
  const handleCropComplete = useCallback(
    async (croppedArea: any, croppedAreaPixels: any) => {
      if (!cropModal.platform || cropModal.imageIdx === null) return;
      setCropModal((modal) => ({ ...modal, loading: true }));
      try {
        let width = 1080, height = 1080;
        if (cropModal.platform !== "whatsapp") {
          width = SOCIAL_MEDIA_SIZES[cropModal.platform as keyof typeof SOCIAL_MEDIA_SIZES].w;
          height = SOCIAL_MEDIA_SIZES[cropModal.platform as keyof typeof SOCIAL_MEDIA_SIZES].h;
        }
        const croppedBlob = await getCroppedImg(
          cropModal.imageUrl,
          croppedAreaPixels,
          width,
          height
        );
        const url = URL.createObjectURL(croppedBlob as Blob);
        setImageVariants((prev: any) => ({
          ...prev,
          [cropModal.imageIdx!]: {
            ...(prev[cropModal.imageIdx!] || {}),
            [cropModal.platform as string]: { blob: croppedBlob, url, w: width, h: height }
          }
        }));
      } catch (error) {
        console.error('Crop error:', error);
      } finally {
        setCropModal((modal) => ({ ...modal, open: false, loading: false }));
      }
    },
    [cropModal, images]
  );

  // Görsel Sil
  const removeImage = (imageId: number) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    setImageVariants((prev: any) => {
      const newVariants = { ...prev };
      delete newVariants[imageId];
      return newVariants;
    });
  };

  // Video Sil
  const removeVideo = (videoId: number) => {
    setVideos(prev => prev.filter(vid => vid.id !== videoId));
  };

  // Sosyal Medya Toggle
  const handlePlatformToggle = (key: string) => {
    setSharePlatforms(prev =>
      prev.includes(key) ? prev.filter((p: string) => p !== key) : [...prev, key]
    );
  };

  // Önceki Haber Seçimi Toggle
  const handlePrevNewsSelect = (id: string) => {
    setSelectedPrevNews(prev =>
      prev.includes(id) ? prev.filter((n: string) => n !== id) : [...prev, id]
    );
  };

  // Etiket ekleme
  const handleAddTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Etiket silme
  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  // AI ile Haber İçeriği Üret
  const handleAIGenerateContent = async () => {
    if (!form.title.trim()) return;
    setAiLoading(true);
    try {
      const aiContent = await aiGenerateContent(form.title);
      setForm(prev => ({ ...prev, content: aiContent }));
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // URL'den görsel ekleme
  const handleAddImageFromUrl = () => {
    const url = prompt('Görsel URL\'sini girin:');
    if (url) {
      const newImage: ImageData = {
        id: Date.now() + Math.random(),
        url: url,
        caption: '',
        alt: 'Harici görsel'
      };
      setImages(prev => [...prev, newImage]);
    }
  };

  // URL'den video ekleme
  const handleAddVideoFromUrl = () => {
    const url = prompt('Video URL\'sini girin (YouTube, Vimeo vb.):');
    if (url) {
      const newVideo: VideoData = {
        id: Date.now() + Math.random(),
        url: url,
        title: 'Harici video',
        description: '',
        embedUrl: convertToEmbedUrl(url)
      };
      setVideos(prev => [...prev, newVideo]);
    }
  };

  const convertToEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Başlık gereklidir');
      return;
    }

    if (!form.content.trim()) {
      alert('İçerik gereklidir');
      return;
    }

    setLoading(true);
    try {
      // Görselleri Firebase Storage'a yüklemek yerine URL'leri kaydet
      const imageUrls = images.map(img => ({
        url: img.url,
        caption: img.caption,
        alt: img.alt
      }));

      const videoUrls = videos.map(vid => ({
        url: vid.url,
        title: vid.title,
        description: vid.description,
        embedUrl: vid.embedUrl || vid.url
      }));

      const newsData = {
        ...form,
        slug: generateSlug(form.title),
        images: imageUrls,
        videos: videoUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        shares: 0,
        socialMediaScheduled: false
      };

      // Öncelik ayarları
      if (form.priority === 'breaking') {
        newsData.breaking = true;
        newsData.urgent = false;
      } else if (form.priority === 'urgent') {
        newsData.urgent = true;
        newsData.breaking = false;
      } else {
        newsData.breaking = false;
        newsData.urgent = false;
      }

      const docRef = await addDoc(collection(db, 'news'), newsData);
      
      alert('✅ Haber başarıyla kaydedildi!');
      router.push('/admin/dashboard/content');
      
    } catch (error: unknown) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      alert('❌ Kaydetme hatası: ' + errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="container mx-auto max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">➕ Yeni Haber Ekle</h1>
        
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="Haber başlığını girin..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* AI ile İçerik Üret */}
          <div>
            <button
              type="button"
              onClick={handleAIGenerateContent}
              disabled={aiLoading || !form.title.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold bg-yellow-50 hover:bg-yellow-100 text-yellow-900 shadow disabled:opacity-70 transition"
              title="Başlığa göre AI içerik üret"
            >
              {aiLoading ? "🤖 Oluşturuluyor..." : "🤖 AI ile İçerik Üret"}
            </button>
            <span className="text-xs text-gray-400 ml-1">
              Başlığa göre otomatik haber metni oluşturmak için butona tıklayın.
            </span>
          </div>

          {/* İçerik */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İçerik *
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleInputChange}
              rows={12}
              placeholder="Haber içeriğini yazın... (HTML etiketlerini kullanabilirsiniz)"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm font-mono"
            />
            <div className="mt-2 text-sm text-gray-500">
              HTML etiketlerini kullanabilirsiniz: &lt;p&gt;, &lt;h1-h6&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;br&gt;, &lt;a&gt;
            </div>
          </div>

          {/* Özet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Özet
              </label>
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={autoSummary}
                  onChange={(e) => setAutoSummary(e.target.checked)}
                  className="mr-1"
                />
                Otomatik özet
              </label>
            </div>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleInputChange}
              rows={3}
              placeholder="Haber özetini girin..."
              disabled={autoSummary}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm disabled:bg-gray-50"
            />
          </div>

          {/* Görseller */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">🖼️ Görseller</h3>
            
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 shadow"
              >
                📁 Dosya Seç
              </button>
              <button
                type="button"
                onClick={handleAddImageFromUrl}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 shadow"
              >
                🔗 URL Ekle
              </button>
            </div>
            
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
              className="hidden"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative border rounded-xl p-3 bg-white shadow">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) => {
                        setImages(prev => prev.map(img => 
                          img.id === image.id ? { ...img, caption: e.target.value } : img
                        ));
                      }}
                      placeholder="Görsel açıklaması..."
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 mb-2"
                    />
                    
                    {/* Sosyal Medya Crop Butonları */}
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-1">Sosyal medya için kırp:</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(SOCIAL_MEDIA_SIZES).map(platform => (
                          <button
                            key={platform}
                            type="button"
                            onClick={() => openCropModal(index, platform)}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border text-gray-700"
                            title={`${platform} için kırp (${SOCIAL_MEDIA_SIZES[platform as keyof typeof SOCIAL_MEDIA_SIZES].w}x${SOCIAL_MEDIA_SIZES[platform as keyof typeof SOCIAL_MEDIA_SIZES].h})`}
                          >
                            {platform === 'facebook' ? '📘' : 
                             platform === 'twitter' ? '🐦' : 
                             platform === 'instagram' ? '📷' : 
                             platform === 'linkedin' ? '💼' : 
                             platform === 'whatsapp' ? '💬' : platform}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {index === 0 ? 'Ana görsel' : `Görsel ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videolar */}
          <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">📺 Videolar</h3>
            
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-700 shadow"
              >
                📁 Video Seç
              </button>
              <button
                type="button"
                onClick={handleAddVideoFromUrl}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 shadow"
              >
                🔗 URL Ekle
              </button>
            </div>
            
            <input
              ref={videoInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideosChange}
              className="hidden"
            />

            {videos.length > 0 && (
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <div key={video.id} className="border rounded-xl p-4 bg-white shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-2xl">📺</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) => {
                            setVideos(prev => prev.map(vid => 
                              vid.id === video.id ? { ...vid, title: e.target.value } : vid
                            ));
                          }}
                          placeholder="Video başlığı..."
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={video.description}
                          onChange={(e) => {
                            setVideos(prev => prev.map(vid => 
                              vid.id === video.id ? { ...vid, description: e.target.value } : vid
                            ));
                          }}
                          placeholder="Video açıklaması..."
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Video {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeVideo(video.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video URL
            </label>
            <input
              type="url"
              name="youtube"
              value={form.youtube}
              onChange={handleInputChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Etiketler */}
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-green-800 mb-4">🏷️ Etiketler</h3>
            
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Etiket ekle..."
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow"
              >
                ➕
              </button>
            </div>

            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full shadow"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Yazar ve Kaynak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yazar
              </label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleInputChange}
                placeholder="Yazar adı..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kaynak
              </label>
              <input
                type="text"
                name="source"
                value={form.source}
                onChange={handleInputChange}
                placeholder="Haber kaynağı..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Öncelik */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Öncelik
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            >
              <option value="normal">🔘 Normal</option>
              <option value="urgent">⚡ Acil</option>
              <option value="breaking">🚨 Flaş Haber</option>
            </select>
          </div>

          {/* Kaydetme Butonları */}
          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors shadow"
            >
              ❌ İptal
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow font-semibold"
            >
              {loading ? '⏳ Kaydediliyor...' : '💾 Kaydet ve Yayınla'}
            </button>
          </div>
        </form>

        {/* Crop Modal */}
        <CropDialog 
          cropModal={cropModal}
          setCropModal={setCropModal}
          handleCropComplete={handleCropComplete}
        />
      </div>
    </div>
  );
}
