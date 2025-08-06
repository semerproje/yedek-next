// Social Media Management Service
import { db } from '@/lib/firebase'
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'

export class SocialMediaManager {
  constructor() {
    this.platforms = {
      facebook: {
        name: 'Facebook',
        icon: '📘',
        maxLength: 2200,
        supportsImages: true,
        supportsVideos: true,
        hashtagSupport: true
      },
      instagram: {
        name: 'Instagram',
        icon: '📸',
        maxLength: 2200,
        supportsImages: true,
        supportsVideos: true,
        hashtagSupport: true,
        requiresImage: true
      },
      twitter: {
        name: 'Twitter/X',
        icon: '🐦',
        maxLength: 280,
        supportsImages: true,
        supportsVideos: true,
        hashtagSupport: true
      },
      linkedin: {
        name: 'LinkedIn',
        icon: '💼',
        maxLength: 1300,
        supportsImages: true,
        supportsVideos: true,
        hashtagSupport: true
      },
      youtube: {
        name: 'YouTube',
        icon: '📺',
        maxLength: 5000,
        supportsImages: false,
        supportsVideos: true,
        hashtagSupport: true,
        requiresVideo: true
      }
    }
  }

  // AI ile sosyal medya içeriği oluştur
  async generateSocialContent(news, platform) {
    const platformConfig = this.platforms[platform]
    if (!platformConfig) throw new Error('Desteklenmeyen platform')

    const { title, content, category, tags, priority, breaking, urgent } = news
    const maxLength = platformConfig.maxLength

    try {
      // Bu kısmı AI servisi ile entegre edebilirsiniz (OpenAI, Gemini, vs.)
      let socialContent = ''
      
      if (platform === 'twitter') {
        // Twitter için kısa ve etkili içerik
        socialContent = await this.generateTwitterContent(news)
      } else if (platform === 'instagram') {
        // Instagram için görsel odaklı içerik
        socialContent = await this.generateInstagramContent(news)
      } else if (platform === 'facebook') {
        // Facebook için detaylı içerik
        socialContent = await this.generateFacebookContent(news)
      } else if (platform === 'linkedin') {
        // LinkedIn için profesyonel içerik
        socialContent = await this.generateLinkedInContent(news)
      } else if (platform === 'youtube') {
        // YouTube için video açıklaması
        socialContent = await this.generateYouTubeContent(news)
      }

      return {
        content: socialContent,
        hashtags: this.generateHashtags(news, platform),
        platform: platform,
        newsId: news.id,
        scheduledFor: this.suggestOptimalTime(platform, category),
        priority: priority,
        breaking: breaking,
        urgent: urgent
      }
      
    } catch (error) {
      console.error('AI content generation error:', error)
      return this.generateFallbackContent(news, platform)
    }
  }

  // Twitter içeriği oluştur
  async generateTwitterContent(news) {
    const { title, category, breaking, urgent } = news
    
    let prefix = ''
    if (breaking) prefix = '🚨 FLAŞ: '
    else if (urgent) prefix = '⚡ ACİL: '
    else if (category === 'spor') prefix = '⚽ '
    else if (category === 'ekonomi') prefix = '💰 '
    else if (category === 'teknoloji') prefix = '🔬 '
    
    const maxContentLength = 280 - prefix.length - 50 // URL ve hashtag için yer bırak
    
    const shortTitle = title.length > maxContentLength 
      ? title.substring(0, maxContentLength - 3) + '...'
      : title
    
    return `${prefix}${shortTitle}`
  }

  // Instagram içeriği oluştur
  async generateInstagramContent(news) {
    const { title, summary, category } = news
    
    const categoryEmojis = {
      gundem: '🗞️',
      spor: '⚽',
      ekonomi: '💰',
      teknoloji: '🔬',
      saglik: '🏥',
      kultur: '🎨',
      dunya: '🌍'
    }
    
    const emoji = categoryEmojis[category] || '📰'
    
    return `${emoji} ${title}

${summary}

Detaylar için bio linkimizden ulaşabilirsiniz.`
  }

  // Facebook içeriği oluştur
  async generateFacebookContent(news) {
    const { title, summary, content, category } = news
    
    const shortContent = content.length > 300 
      ? content.substring(0, 300) + '...'
      : content
    
    return `📰 ${title}

${summary}

${shortContent}

Haberin devamı için tıklayın.`
  }

  // LinkedIn içeriği oluştur
  async generateLinkedInContent(news) {
    const { title, summary, category } = news
    
    const categoryContexts = {
      ekonomi: 'Ekonomi dünyasından önemli gelişme:',
      teknoloji: 'Teknoloji sektöründen dikkat çeken haber:',
      politika: 'Siyaset alanından güncel gelişme:',
      default: 'Günün önemli haberlerinden:'
    }
    
    const context = categoryContexts[category] || categoryContexts.default
    
    return `${context}

📰 ${title}

${summary}

Bu konuyla ilgili görüşlerinizi yorumlarda paylaşabilirsiniz.`
  }

  // YouTube içeriği oluştur
  async generateYouTubeContent(news) {
    const { title, content, tags } = news
    
    return `${title}

${content}

🎯 Bu videoda:
- Konuyla ilgili detaylı analiz
- Uzman görüşleri
- Son gelişmeler

📢 Kanalımıza abone olmayı unutmayın!
🔔 Bildirimleri açarak haberlerden ilk siz haberdar olun!

#haber #gündem ${tags?.slice(0, 3).map(tag => `#${tag}`).join(' ') || ''}`
  }

  // Hashtag oluştur
  generateHashtags(news, platform) {
    const { category, tags, breaking, urgent } = news
    const platformConfig = this.platforms[platform]
    
    if (!platformConfig.hashtagSupport) return []
    
    const hashtags = []
    
    // Temel hashtagler
    hashtags.push('haber', 'gündem', 'türkiye')
    
    // Kategori hashtag'i
    if (category) hashtags.push(category)
    
    // Öncelik hashtag'leri
    if (breaking) hashtags.push('flaş', 'sondakika')
    else if (urgent) hashtags.push('acil')
    
    // Haber etiketleri
    if (tags && tags.length > 0) {
      hashtags.push(...tags.slice(0, 5))
    }
    
    // Platform özel sınırlamalar
    const maxHashtags = platform === 'twitter' ? 5 : platform === 'instagram' ? 20 : 10
    
    return hashtags
      .slice(0, maxHashtags)
      .map(tag => tag.replace(/\s+/g, '').toLowerCase())
  }

  // Optimal paylaşım zamanı öner
  suggestOptimalTime(platform, category) {
    const now = new Date()
    const hour = now.getHours()
    
    // Platform ve kategori bazlı optimal saatler
    const optimalTimes = {
      twitter: {
        default: [9, 12, 15, 18], // Genel
        spor: [20, 21, 22], // Akşam saatleri
        ekonomi: [8, 9, 17, 18] // İş saatleri
      },
      facebook: {
        default: [13, 15, 18, 20],
        weekend: [12, 14, 16]
      },
      instagram: {
        default: [11, 13, 17, 19, 21],
        weekend: [10, 12, 14, 16]
      },
      linkedin: {
        default: [8, 9, 12, 17, 18], // İş saatleri
        weekend: null // Hafta sonu paylaşım önerilmez
      },
      youtube: {
        default: [14, 15, 16, 19, 20, 21]
      }
    }
    
    const platformTimes = optimalTimes[platform]
    const categoryTimes = platformTimes?.[category] || platformTimes?.default
    
    if (!categoryTimes) return new Date(now.getTime() + 60 * 60 * 1000) // 1 saat sonra
    
    // Bir sonraki optimal zamanı bul
    const nextOptimalHour = categoryTimes.find(time => time > hour) || categoryTimes[0]
    
    const suggestedTime = new Date(now)
    if (nextOptimalHour <= hour) {
      // Ertesi gün
      suggestedTime.setDate(suggestedTime.getDate() + 1)
    }
    suggestedTime.setHours(nextOptimalHour, 0, 0, 0)
    
    return suggestedTime
  }

  // Fallback içerik oluştur (AI başarısız olursa)
  generateFallbackContent(news, platform) {
    const { title, summary } = news
    const platformConfig = this.platforms[platform]
    
    const maxLength = platformConfig.maxLength - 100 // Hashtag ve URL için yer
    
    let content = title
    if (summary && content.length + summary.length < maxLength) {
      content += `\n\n${summary}`
    }
    
    return {
      content: content,
      hashtags: this.generateHashtags(news, platform),
      platform: platform,
      newsId: news.id,
      scheduledFor: this.suggestOptimalTime(platform, news.category),
      priority: news.priority,
      breaking: news.breaking,
      urgent: news.urgent
    }
  }

  // Sosyal medya gönderisini veritabanına kaydet
  async saveSocialPost(socialContent) {
    try {
      const postData = {
        ...socialContent,
        status: 'scheduled', // scheduled, posted, failed
        createdAt: serverTimestamp(),
        attempts: 0,
        lastAttempt: null,
        error: null
      }
      
      const docRef = await addDoc(collection(db, 'social_media_posts'), postData)
      
      console.log(`✅ Sosyal medya gönderisi kaydedildi: ${docRef.id}`)
      return { success: true, id: docRef.id }
      
    } catch (error) {
      console.error('Social post save error:', error)
      return { success: false, error: error.message }
    }
  }

  // Haberi tüm platformlara zamanla
  async scheduleNewsToAllPlatforms(news, selectedPlatforms) {
    const platforms = selectedPlatforms || Object.keys(this.platforms)
    const results = []
    
    for (const platform of platforms) {
      try {
        // Platform gereksinimleri kontrolü
        const platformConfig = this.platforms[platform]
        
        if (platformConfig.requiresImage && (!news.images || news.images.length === 0)) {
          console.log(`⚠️ ${platform} için görsel gerekli, atlanıyor`)
          continue
        }
        
        if (platformConfig.requiresVideo && (!news.videos || news.videos.length === 0)) {
          console.log(`⚠️ ${platform} için video gerekli, atlanıyor`)
          continue
        }
        
        // İçerik oluştur
        const socialContent = await this.generateSocialContent(news, platform)
        
        // Veritabanına kaydet
        const saveResult = await this.saveSocialPost(socialContent)
        
        results.push({
          platform,
          success: saveResult.success,
          id: saveResult.id,
          scheduledFor: socialContent.scheduledFor,
          error: saveResult.error
        })
        
      } catch (error) {
        console.error(`${platform} scheduling error:`, error)
        results.push({
          platform,
          success: false,
          error: error.message
        })
      }
    }
    
    // Haber dokümantını güncelle
    if (results.some(r => r.success)) {
      try {
        await updateDoc(doc(db, 'news', news.id), {
          socialMediaScheduled: true,
          socialMediaPosts: results.filter(r => r.success).map(r => ({
            platform: r.platform,
            postId: r.id,
            scheduledFor: r.scheduledFor
          })),
          updatedAt: serverTimestamp()
        })
      } catch (error) {
        console.error('News update error:', error)
      }
    }
    
    return results
  }

  // AI ile günlük paylaşım önerisi
  async suggestDailyPosts(limit = 10) {
    try {
      // Son 24 saat içindeki paylaşılmamış önemli haberleri getir
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      const q = query(
        collection(db, 'news'),
        where('publishedAt', '>=', yesterday),
        where('socialMediaScheduled', '==', false)
      )
      
      const querySnapshot = await getDocs(q)
      const unsharedNews = []
      
      querySnapshot.forEach(doc => {
        unsharedNews.push({ id: doc.id, ...doc.data() })
      })
      
      // AI ile öncelik sıralaması (basit algoritma)
      const scoredNews = unsharedNews.map(news => ({
        ...news,
        score: this.calculateViralityScore(news)
      }))
      
      // Skor'a göre sırala ve en iyileri al
      const topNews = scoredNews
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
      
      console.log(`📊 ${topNews.length} haber günlük paylaşım için önerildi`)
      return topNews
      
    } catch (error) {
      console.error('Daily suggestion error:', error)
      return []
    }
  }

  // Viral olma potansiyeli skorla
  calculateViralityScore(news) {
    let score = 0
    
    // Öncelik skorları
    if (news.breaking) score += 50
    else if (news.urgent) score += 30
    else if (news.priority === 'important') score += 20
    
    // Kategori skorları
    const categoryScores = {
      gundem: 25,
      spor: 20,
      politika: 18,
      ekonomi: 15,
      teknoloji: 12,
      saglik: 10
    }
    score += categoryScores[news.category] || 5
    
    // Medya içeriği bonusu
    if (news.videos && news.videos.length > 0) score += 15
    if (news.images && news.images.length > 0) score += 10
    
    // Etkileşim skorları
    score += (news.views || 0) * 0.01
    score += (news.likes || 0) * 0.5
    score += (news.shares || 0) * 2
    
    // Başlık uzunluğu (optimal: 50-100 karakter)
    const titleLength = news.title?.length || 0
    if (titleLength >= 50 && titleLength <= 100) score += 5
    
    return Math.round(score)
  }

  // Otomatik zamanlama sistemi
  async scheduleNewsToAllPlatforms(news, platforms, options = {}) {
    const { timeSlots = ['09:00', '12:00', '15:00', '18:00', '21:00'], minTimeBetweenPosts = 30 } = options
    const results = []
    
    try {
      const currentTime = new Date()
      
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        
        // Platform için içerik oluştur
        const socialContent = await this.generateSocialContent(news, platform)
        
        // Zamanlama hesapla
        const scheduledTime = this.calculateOptimalScheduleTime(platform, timeSlots, i, minTimeBetweenPosts)
        
        // Veritabanına kaydet
        const postData = {
          ...socialContent,
          scheduledFor: scheduledTime,
          status: 'scheduled',
          createdAt: serverTimestamp(),
          autoScheduled: true
        }
        
        try {
          const docRef = await addDoc(collection(db, 'social_media_posts'), postData)
          results.push({ success: true, platform, postId: docRef.id })
          
          // Haberi zamanlandı olarak işaretle
          if (news.id) {
            await updateDoc(doc(db, 'news', news.id), {
              socialMediaScheduled: true,
              lastSocialUpdate: serverTimestamp()
            })
          }
          
        } catch (error) {
          console.error(`Platform ${platform} schedule error:`, error)
          results.push({ success: false, platform, error: error.message })
        }
      }
      
      return results
      
    } catch (error) {
      console.error('Auto schedule error:', error)
      throw error
    }
  }

  // Optimal zamanlama hesapla
  calculateOptimalScheduleTime(platform, timeSlots, index, minTimeBetweenPosts) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Platform bazlı optimal saatler
    const platformOptimalTimes = {
      facebook: ['09:00', '13:00', '19:00'],
      instagram: ['11:00', '14:00', '20:00'],
      twitter: ['09:00', '12:00', '17:00', '19:00'],
      linkedin: ['08:00', '12:00', '17:00'],
      youtube: ['14:00', '20:00']
    }
    
    const optimalTimes = platformOptimalTimes[platform] || timeSlots
    
    // En yakın optimal zamanı bul
    let targetTime = null
    for (const timeStr of optimalTimes) {
      const [hours, minutes] = timeStr.split(':').map(Number)
      const targetDateTime = new Date(today)
      targetDateTime.setHours(hours, minutes, 0, 0)
      
      // Geleceğe ekle
      targetDateTime.setMinutes(targetDateTime.getMinutes() + (index * minTimeBetweenPosts))
      
      // Geçmişte ise ertesi güne al
      if (targetDateTime <= now) {
        targetDateTime.setDate(targetDateTime.getDate() + 1)
      }
      
      targetTime = targetDateTime
      break
    }
    
    return targetTime || new Date(now.getTime() + (30 * 60 * 1000)) // 30 dk sonra varsayılan
  }

  // Toplu otomatik zamanlama
  async bulkAutoSchedule(newsList, settings) {
    const results = []
    
    try {
      // Haberleri skorlarına göre sırala
      const sortedNews = newsList
        .map(news => ({ ...news, score: this.calculateViralityScore(news) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, settings.maxPostsPerDay)
      
      for (const news of sortedNews) {
        // Kategori filtresi
        if (settings.categories && !settings.categories.includes(news.category)) continue
        
        // Breaking news filtresi
        if (settings.onlyBreakingNews && !news.breaking) continue
        
        // Zaten zamanlanmış mı kontrol et
        if (news.socialMediaScheduled) continue
        
        const result = await this.scheduleNewsToAllPlatforms(news, settings.platforms, {
          timeSlots: settings.timeSlots,
          minTimeBetweenPosts: settings.minTimeBetweenPosts
        })
        
        results.push({ news: news.title, results: result })
      }
      
      return results
      
    } catch (error) {
      console.error('Bulk auto schedule error:', error)
      throw error
    }
  }
}

export default SocialMediaManager
