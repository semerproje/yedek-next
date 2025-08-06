// net-haberler/frontend/src/pages/admin/AddNewsPage.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import AddNewsTitleField from "./news/AddNewsTitleField";
import AddNewsCategoryField from "./news/AddNewsCategoryField";
import AddNewsDateField from "./news/AddNewsDateField";
import AddNewsContentField from "./news/AddNewsContentField";
import AddNewsSummaryField from "./news/AddNewsSummaryField";
import AddNewsImagesField from "./news/AddNewsImagesField";
import AddNewsVideosField from "./news/AddNewsVideosField";
import AddNewsYoutubeField from "./news/AddNewsYoutubeField";
import AddNewsSharePlatformsField from "./news/AddNewsSharePlatformsField";
import AddNewsPrevNewsField from "./news/AddNewsPrevNewsField";
import AddNewsButtons from "./news/AddNewsButtons";
import CropDialog from "./news/CropDialog";
import {
  SOCIAL_MEDIA_SIZES,
} from "./news/constants";
import { useNavigate } from "react-router-dom";

// --- Görsel kırpma fonksiyonu ---
async function getCroppedImg(imageSrc, croppedAreaPixels, width = 1080, height = 1080) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
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

// --- AI demo haber içeriği (geliştirme aşamasında) ---
async function aiGenerateContent(headline) {
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

export default function AddNewsPage() {
  const imageInputRef = useRef();
  const videoInputRef = useRef();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    content: "",
    youtube: "",
  });
  const [summary, setSummary] = useState("");
  const [autoSummary, setAutoSummary] = useState(true);

  const [images, setImages] = useState([]);
  const [imageVariants, setImageVariants] = useState({});
  const [videos, setVideos] = useState([]);
  const [sharePlatforms, setSharePlatforms] = useState([]);
  const [cropModal, setCropModal] = useState({
    open: false,
    imageIdx: null,
    platform: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 1,
    imageUrl: null,
    loading: false,
  });
  const [loading, setLoading] = useState(false);

  // Önceki haberler
  const [newsList, setNewsList] = useState([]);
  const [prevNewsMode, setPrevNewsMode] = useState("auto");
  const [selectedPrevNews, setSelectedPrevNews] = useState([]);
  const [autoPrevNewsCount, setAutoPrevNewsCount] = useState(3);
  const [fetchingNews, setFetchingNews] = useState(false);

  // AI loading
  const [aiLoading, setAiLoading] = useState(false);

  // --- Firestore'dan son 20 haberi çek
  useEffect(() => {
    setFetchingNews(true);
    getDocs(query(collection(db, "news"), orderBy("date", "desc"), limit(20)))
      .then(snapshot => {
        setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
      .finally(() => setFetchingNews(false));
  }, []);

  // --- İçerik değiştikçe otomatik özet oluştur
  useEffect(() => {
    if (autoSummary) {
      const plain = form.content.replace(/<[^>]+>/g, " ");
      setSummary(plain.slice(0, 200));
    }
  }, [form.content, autoSummary]);

  // --- Görsel Yükleme
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [
      ...prev,
      ...files.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }))
    ]);
  };

  // --- Video Yükleme
  const handleVideosChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(prev => [
      ...prev,
      ...files.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }))
    ]);
  };

  // --- Crop Modal Aç
  const openCropModal = (idx, plat) => {
    setCropModal({
      open: true,
      imageIdx: idx,
      platform: plat,
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: plat !== "whatsapp" ? SOCIAL_MEDIA_SIZES[plat]?.w / SOCIAL_MEDIA_SIZES[plat]?.h : 1,
      imageUrl: images[idx]?.url,
      loading: false,
    });
  };

  // --- Crop İşlemi Kaydet
  const handleCropComplete = useCallback(
    async (croppedArea, croppedAreaPixels) => {
      if (!cropModal.platform || cropModal.imageIdx === null) return;
      setCropModal((modal) => ({ ...modal, loading: true }));
      try {
        let w = 1080, h = 1080;
        if (cropModal.platform !== "whatsapp" && SOCIAL_MEDIA_SIZES[cropModal.platform]) {
          w = SOCIAL_MEDIA_SIZES[cropModal.platform].w;
          h = SOCIAL_MEDIA_SIZES[cropModal.platform].h;
        }
        const croppedBlob = await getCroppedImg(
          cropModal.imageUrl,
          croppedAreaPixels,
          w,
          h
        );
        const url = URL.createObjectURL(croppedBlob);
        setImageVariants((prev) => ({
          ...prev,
          [cropModal.imageIdx]: {
            ...(prev[cropModal.imageIdx] || {}),
            [cropModal.platform]: { blob: croppedBlob, url, w, h }
          }
        }));
      } finally {
        setCropModal((modal) => ({ ...modal, open: false, loading: false }));
      }
    },
    [cropModal, images]
  );

  // --- Görsel Sil
  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImageVariants(prev => {
      const nv = { ...prev };
      delete nv[idx];
      return nv;
    });
  };

  // --- Sosyal Medya Toggle
  const handlePlatformToggle = (key) => {
    setSharePlatforms(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  // --- Önceki Haber Seçimi Toggle
  const handlePrevNewsSelect = (id) => {
    setSelectedPrevNews(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  // --- AI ile Haber İçeriği Üret (Demo)
  const handleAIGenerateContent = async () => {
    if (!form.title.trim()) return;
    setAiLoading(true);
    const aiContent = await aiGenerateContent(form.title);
    setForm(f => ({ ...f, content: aiContent }));
    setAiLoading(false);
  };

  // --- FORM SUBMIT (DEMO) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Burada Firestore'a kaydetme kodunuzu entegre edebilirsiniz.
    setTimeout(() => {
      setLoading(false);
      alert("Haber kaydedildi! (DEMO)");
      navigate("/admin/haberler");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="container mx-auto max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Yeni Haber Ekle</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <AddNewsTitleField
            value={form.title}
            onChange={val => setForm(f => ({ ...f, title: val }))}
          />

          <AddNewsCategoryField
            value={form.category}
            onChange={val => setForm(f => ({ ...f, category: val }))}
          />

          <AddNewsDateField
            value={form.date}
            onChange={val => setForm(f => ({ ...f, date: val }))}
          />

          {/* AI ile demo içerik üretme butonu */}
          <div>
            <button
              type="button"
              onClick={handleAIGenerateContent}
              disabled={aiLoading || !form.title.trim()}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border font-semibold bg-yellow-50 hover:bg-yellow-100 text-yellow-900 shadow disabled:opacity-70 transition"
              title="Başlığa göre AI içerik üret"
            >
              {aiLoading ? "Oluşturuluyor..." : "AI ile İçerik Üret"}
            </button>
            <span className="text-xs text-gray-400 ml-1">
              Başlığa göre otomatik haber metni oluşturmak için butona tıklayın.
            </span>
          </div>

          <AddNewsContentField
            value={form.content}
            onChange={val => setForm(f => ({ ...f, content: val }))}
          />

          <AddNewsSummaryField
            value={summary}
            onChange={val => setSummary(val)}
            autoSummary={autoSummary}
            setAutoSummary={setAutoSummary}
          />

          <AddNewsImagesField
            images={images}
            handleImagesChange={handleImagesChange}
            removeImage={removeImage}
            imageVariants={imageVariants}
            openCropModal={openCropModal}
            loading={loading}
          />

          {cropModal.open && (
            <CropDialog
              cropModal={cropModal}
              setCropModal={setCropModal}
              handleCropComplete={handleCropComplete}
            />
          )}

          <AddNewsVideosField
            handleVideosChange={handleVideosChange}
            loading={loading}
          />

          <AddNewsYoutubeField
            value={form.youtube}
            onChange={val => setForm(f => ({ ...f, youtube: val }))}
            loading={loading}
          />

          <AddNewsSharePlatformsField
            sharePlatforms={sharePlatforms}
            handlePlatformToggle={handlePlatformToggle}
            loading={loading}
          />

          <AddNewsPrevNewsField
            prevNewsMode={prevNewsMode}
            setPrevNewsMode={setPrevNewsMode}
            autoPrevNewsCount={autoPrevNewsCount}
            setAutoPrevNewsCount={setAutoPrevNewsCount}
            newsList={newsList}
            selectedPrevNews={selectedPrevNews}
            handlePrevNewsSelect={handlePrevNewsSelect}
            fetchingNews={fetchingNews}
          />

          <AddNewsButtons loading={loading} />
        </form>
      </div>
    </div>
  );
}
