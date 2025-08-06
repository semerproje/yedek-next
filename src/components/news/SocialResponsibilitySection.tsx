"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Users, Gift, Star } from "lucide-react";
import { collection, addDoc, getDocs, query, orderBy, limit, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AvatarImage } from '@/components/ui/SafeImage';

interface HopeMessage {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isAnonymous: boolean;
}

interface SocialResponsibilitySectionProps {
  newsId: string;
}

export default function SocialResponsibilitySection({ newsId }: SocialResponsibilitySectionProps) {
  const [hopeMessages, setHopeMessages] = useState<HopeMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState("");

  // Firebase'den umut mesajlarını getir
  useEffect(() => {
    const fetchHopeMessages = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'hope_messages'),
          where('newsId', '==', newsId),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        
        const querySnapshot = await getDocs(q);
        const messages: HopeMessage[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            author: {
              name: data.isAnonymous ? 'Anonim' : data.authorName || 'İsimsiz',
              avatar: data.isAnonymous 
                ? 'https://ui-avatars.com/api/?name=A&background=9ca3af&color=ffffff&size=150'
                : `https://ui-avatars.com/api/?name=U${Math.floor(Math.random() * 10)}&background=${['3b82f6', '06b6d4', '8b5cf6', 'f59e0b', 'ef4444', 'ec4899'][Math.floor(Math.random() * 6)]}&color=ffffff&size=150`
            },
            message: data.message || '',
            timestamp: data.createdAt?.toDate ? 
              new Intl.RelativeTimeFormat('tr').format(
                Math.floor((data.createdAt.toDate().getTime() - Date.now()) / (1000 * 60 * 60)), 
                'hour'
              ) : 'şimdi',
            likes: data.likes || 0,
            isLiked: false, // Bu kullanıcı bazlı olmalı, şimdilik false
            isAnonymous: data.isAnonymous || false
          };
        });
        
        setHopeMessages(messages);
      } catch (error) {
        console.error('Umut mesajları getirilemedi:', error);
        // Hata durumunda örnek veri göster
        setHopeMessages([
          {
            id: 'sample1',
            author: {
              name: 'Zeynep K.',
              avatar: 'https://ui-avatars.com/api/?name=ZK&background=ec4899&color=ffffff&size=150'
            },
            message: 'LÖSEV\'e desteklerimiz devam ediyor. Her çocuğun gülümsemesi bizim için değerli. #gülümseyencocuklar',
            timestamp: '2 saat önce',
            likes: 15,
            isLiked: false,
            isAnonymous: false
          },
          {
            id: 'sample2',
            author: {
              name: 'Anonim',
              avatar: 'https://ui-avatars.com/api/?name=AK&background=10b981&color=ffffff&size=150'
            },
            message: 'Doğtaş\'ın bu sosyal sorumluluk projesini takdir ediyorum. Umut dolu günler dilerim.',
            timestamp: '1 saat önce',
            likes: 8,
            isLiked: false,
            isAnonymous: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHopeMessages();
  }, [newsId]);

  // Yeni umut mesajı gönder
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!isAnonymous && !authorName.trim()) return;

    setSubmitting(true);
    try {
      const messageData = {
        newsId: newsId,
        message: newMessage.trim(),
        authorName: isAnonymous ? '' : authorName.trim(),
        isAnonymous: isAnonymous,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'hope_messages'), messageData);
      
      // Yeni mesajı listeye ekle
      const newHopeMessage: HopeMessage = {
        id: docRef.id,
        author: {
          name: isAnonymous ? 'Anonim' : authorName,
          avatar: isAnonymous 
            ? 'https://ui-avatars.com/api/?name=A&background=9ca3af&color=ffffff&size=150'
            : `https://ui-avatars.com/api/?name=${authorName.charAt(0).toUpperCase()}&background=${['3b82f6', '06b6d4', '8b5cf6', 'f59e0b', 'ef4444', 'ec4899'][Math.floor(Math.random() * 6)]}&color=ffffff&size=150`
        },
        message: newMessage,
        timestamp: 'şimdi',
        likes: 0,
        isLiked: false,
        isAnonymous: isAnonymous
      };

      setHopeMessages(prev => [newHopeMessage, ...prev]);
      setNewMessage("");
      if (!isAnonymous) setAuthorName("");
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      alert('Mesaj gönderilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = (messageId: string) => {
    setHopeMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { 
            ...message, 
            isLiked: !message.isLiked,
            likes: message.isLiked ? message.likes - 1 : message.likes + 1
          }
        : message
    ));
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-800 dark:via-purple-900 dark:to-indigo-900 rounded-xl shadow-lg border border-pink-200 dark:border-purple-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-pink-300 dark:bg-purple-600 rounded w-3/4"></div>
          <div className="h-20 bg-pink-200 dark:bg-purple-700 rounded"></div>
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-pink-300 dark:bg-purple-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-pink-300 dark:bg-purple-600 rounded w-1/4"></div>
                <div className="h-4 bg-pink-200 dark:bg-purple-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-800 dark:via-purple-900 dark:to-indigo-900 rounded-xl shadow-lg border border-pink-200 dark:border-purple-700">
      
      {/* Header - Sosyal Sorumluluk */}
      <div className="p-6 border-b border-pink-200 dark:border-purple-700">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" fill="currentColor" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              LÖSEV - Sosyal Sorumluluk
            </h2>
            <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" fill="currentColor" />
          </div>
          
          {/* Sponsor Logoları */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="w-24 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 border-2 border-pink-200">
                <div className="text-red-600 font-bold text-lg">LÖSEV</div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Ana Partner</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 border-2 border-indigo-200">
                <div className="text-indigo-600 font-bold text-lg">Doğtaş</div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Sponsor</p>
            </div>
          </div>

          {/* Slogan */}
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white rounded-lg p-4 mb-4">
            <h3 className="text-xl font-bold mb-2">Her Yorum Bir Umut</h3>
            <p className="text-sm opacity-90">
              LÖSEV yararına düzenlenen bu kampanyada her umut mesajınız, 
              lösemili çocuklarımıza destek oluyor. #gülümseyencocuklar
            </p>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <MessageCircle className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-600">{hopeMessages.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Umut Mesajı</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <Users className="w-6 h-6 text-pink-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-pink-600">250+</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Destekçi</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <Gift className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-indigo-600">5.000₺</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Toplanan</div>
            </div>
          </div>
        </div>

        {/* Umut Mesajı Formu */}
        <form onSubmit={handleSubmitMessage} className="space-y-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border-2 border-pink-200 dark:border-purple-600">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Umut mesajınızı paylaşın:
            </label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="LÖSEV'e ve çocuklarımıza umut dolu mesajınızı yazın... #gülümseyencocuklar"
              rows={3}
              className="w-full border border-pink-300 dark:border-purple-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {newMessage.length}/500 karakter
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border-2 border-pink-200 dark:border-purple-600">
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Anonim mesaj gönder</span>
              </label>
            </div>
            
            {!isAnonymous && (
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Adınız veya takma adınız"
                className="w-full border border-pink-300 dark:border-purple-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                maxLength={50}
              />
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newMessage.trim() || (!isAnonymous && !authorName.trim()) || submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <Heart size={16} fill="currentColor" />
              {submitting ? 'Gönderiliyor...' : 'Umut Mesajı Gönder'}
            </button>
          </div>
        </form>
      </div>

      {/* Umut Mesajları Listesi */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Umut Mesajları ({hopeMessages.length})
          </h3>
        </div>

        {hopeMessages.map((message) => (
          <div key={message.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-pink-100 dark:border-purple-600 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <AvatarImage
                src={message.author.avatar}
                alt={message.author.name}
                size={40}
                className="border-2 border-pink-200 dark:border-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {message.author.name}
                  </h4>
                  {message.isAnonymous && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      Anonim
                    </span>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {message.message}
                </p>
                
                {/* Mesaj Aksiyonları */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(message.id)}
                    className={`flex items-center gap-1 transition-colors ${
                      message.isLiked 
                        ? "text-red-600 dark:text-red-400" 
                        : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    }`}
                  >
                    <Heart size={14} className={message.isLiked ? "fill-current" : ""} />
                    <span className="text-sm">{message.likes}</span>
                  </button>
                  
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Gift size={14} />
                    <span className="text-xs">LÖSEV'e destek</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {hopeMessages.length === 0 && (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-3" fill="currentColor" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Henüz umut mesajı paylaşılmamış.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              İlk umut mesajını siz gönderin ve LÖSEV'e destek verin! #gülümseyencocuklar
            </p>
          </div>
        )}
      </div>

      {/* Footer - Sosyal Sorumluluk Bilgileri */}
      <div className="p-4 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-700 dark:via-purple-800 dark:to-indigo-800 rounded-b-xl border-t border-pink-200 dark:border-purple-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            🌟 Bu sayfa LÖSEV yararına Doğtaş Mobilya sponsorluğunda hazırlanmıştır.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>📞 LÖSEV: 0212 276 66 00</span>
            <span>🌐 www.losev.org.tr</span>
            <span>💝 #gülümseyencocuklar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
