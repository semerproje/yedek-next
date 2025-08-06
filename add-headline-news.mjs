// 8 Adet Profesyonel Haber Ekleme Scripti
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './src/lib/firebase.js'; // Firebase config'inizi kullanın

const professionalHeadlineNews = [
  {
    title: "Türkiye'nin İlk Quantum Bilgisayarı Geliştiriliyor",
    summary: "TÜBİTAK ve üniversiteler işbirliğiyle geliştirilen quantum bilgisayar projesi, 2025 yılında tamamlanacak. Proje, Türkiye'yi bu alanda dünya ligine taşıyacak.",
    content: `Türkiye'nin teknoloji alanındaki en iddialı projelerinden biri olan quantum bilgisayar geliştirme çalışmaları hızla ilerliyor. TÜBİTAK koordinasyonunda yürütülen proje kapsamında, Orta Doğu Teknik Üniversitesi, İstanbul Teknik Üniversitesi ve Bilkent Üniversitesi'nden araştırmacılar bir araya geldi.

Proje lideri Prof. Dr. Mehmet Özkan, "Bu bilgisayar 50 qubit kapasiteli olacak ve özellikle kriptografi, yapay zeka ve iklim modellemesi alanlarında kullanılacak" dedi. Quantum bilgisayarın, klasik bilgisayarlara göre belirli problemleri milyarlarca kat daha hızlı çözebileceği belirtiliyor.

Türkiye'nin bu alandaki yatırımı 500 milyon TL olarak açıklandı. Quantum teknolojisinde dünya lideri ülkeler arasına girmeyi hedefleyen Türkiye, bu projeyle stratejik teknoloji bağımsızlığında önemli bir adım atıyor.`,
    category: "teknoloji",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
        caption: "Quantum bilgisayar laboratuvarı",
        alt: "Quantum teknoloji geliştirme"
      }
    ],
    author: "Dr. Ahmet Tekniker",
    source: "NetNext",
    status: "published",
    views: 4250,
    tags: ["quantum", "teknoloji", "tübitak", "bilim"],
    breaking: false,
    urgent: false,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "İstanbul Havalimanı'na Yeni Terminal: Kapasite 200 Milyon Yolcu",
    summary: "İstanbul Havalimanı'nın 3. fazı kapsamında inşa edilecek yeni terminal, yıllık 200 milyon yolcu kapasitesine ulaşacak. Proje 2027'de tamamlanacak.",
    content: `İstanbul Havalimanı'nın genişleme projesi kapsamında inşa edilecek yeni terminal, dünyanın en büyük havalimanı kompleksini oluşturacak. İGA Havalimanı İşletmesi'nden yapılan açıklamaya göre, 3. faz çalışmaları bu yıl başlayacak.

Yeni terminal binası 1.5 milyon metrekare kapalı alana sahip olacak ve 120 uçak park pozisyonu bulunduracak. Terminal, sürdürülebilir mimari anlayışıyla tasarlanıyor ve LEED Platinum sertifikası almayı hedefliyor.

Ulaştırma ve Altyapı Bakanı Abdulkadir Uraloğlu, "Bu yatırımla İstanbul Havalimanı, küresel havacılık merkezi konumunu pekiştirecek" açıklamasında bulundu. Proje toplam maliyeti 15 milyar dolar olarak hesaplanıyor.`,
    category: "ekonomi",
    images: [
      {
        url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
        caption: "İstanbul Havalimanı terminal binası",
        alt: "Havalimanı inşaat projesi"
      }
    ],
    author: "İnşaat Editörü",
    source: "NetNext",
    status: "published",
    views: 6780,
    tags: ["havalimanı", "istanbul", "ulaştırma", "yatırım"],
    breaking: false,
    urgent: false,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "Yeşil Enerji Devrim: Türkiye'de Hidrojen Üretimi Başladı",
    summary: "Kayseri'de kurulan ilk yeşil hidrojen üretim tesisi üretime başladı. Günlük 5 ton kapasiteli tesis, temiz enerji dönüşümünde önemli adım.",
    content: `Türkiye'nin yeşil enerji hedefleri doğrultusunda Kayseri Organize Sanayi Bölgesi'nde kurulan hidrojen üretim tesisi resmi olarak açıldı. Günlük 5 ton yeşil hidrojen üretim kapasitesine sahip tesis, güneş enerjisiyle çalışıyor.

Enerji ve Tabii Kaynaklar Bakanı Alparslan Bayraktar, açılış töreninde "2053 net sıfır emisyon hedefimize ulaşmada hidrojen kritik öneme sahip" dedi. Tesis, elektroliz yöntemiyle su molekülünü hidrojen ve oksijene ayırıyor.

Proje ortakları arasında BOTAŞ, TÜPRAŞ ve Akenerji bulunuyor. İlk etapta çelik ve cam sanayi için üretilecek hidrojen, ilerleyen dönemde ulaşım sektöründe de kullanılacak. Türkiye'nin 2030 hedefi yıllık 1 milyon ton yeşil hidrojen üretimi.`,
    category: "cevre",
    images: [
      {
        url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
        caption: "Yeşil hidrojen üretim tesisi",
        alt: "Hidrojen enerjisi teknolojisi"
      }
    ],
    author: "Çevre Editörü",
    source: "NetNext",
    status: "published",
    views: 3420,
    tags: ["hidrojen", "yeşil enerji", "kayseri", "çevre"],
    breaking: false,
    urgent: false,
    featured: false,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "Milli Eğitim'den Dijital Dönüşüm: Tüm Okullara Fiber İnternet",
    summary: "2025 eğitim-öğretim yılında tüm devlet okullarına fiber internet altyapısı tamamlanıyor. 65 bin okul yüksek hızlı internete kavuşacak.",
    content: `Milli Eğitim Bakanlığı'nın dijital eğitim atılımı kapsamında, Türkiye genelindeki 65 bin devlet okuluna fiber internet altyapısı kurulum çalışmaları tamamlanıyor. Proje, 2025-2026 eğitim-öğretim yılı başında hizmete girecek.

Milli Eğitim Bakanı Yusuf Tekin, "Her öğrencimiz eşit dijital imkanlara sahip olacak" açıklamasında bulundu. Proje kapsamında ayrıca 2 milyon tablet ve laptop öğrencilere dağıtılacak.

BTK ve Türk Telekom ortaklığında yürütülen proje, 4 milyar TL yatırım gerektiriyor. Okullarda kurulacak Wi-Fi 6 teknolojisi, sınıf başına 50 Mbps hız sağlayacak. Uzaktan eğitim alt yapısı da güçlendiriliyor.`,
    category: "egitim",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800&h=600&fit=crop",
        caption: "Dijital sınıf ortamı",
        alt: "Okullarda teknoloji kullanımı"
      }
    ],
    author: "Eğitim Editörü",
    source: "NetNext",
    status: "published",
    views: 5670,
    tags: ["eğitim", "dijital", "fiber internet", "teknoloji"],
    breaking: false,
    urgent: false,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "Türk Yapımı İHA'lar Dünya Pazarında Lider: 60 Ülkeye İhracat",
    summary: "Bayraktar TB2 ve Akıncı İHA'ları 60 ülkede kullanılıyor. Türkiye, insansız hava araçları pazarında dünya 3. sırasına yükseldi.",
    content: `Türkiye'nin savunma sanayiindeki başarı hikayesi devam ediyor. Baykar firması tarafından üretilen Bayraktar TB2 ve Akıncı İHA'ları şu anda 60 farklı ülkede operasyonel olarak kullanılıyor.

Baykar Teknik Müdürü Selçuk Bayraktar, "2024 yılında 180 adet İHA ihraç ettik ve cirromuz 2 milyar doları aştı" dedi. Şirket, yeni nesil jet motorlu İHA projesi KIZILELMA için de 15 ülkeden sipariş aldı.

Savunma sanayii ihracatında İHA'ların payı yüzde 35'e ulaştı. Türkiye, ABD ve Çin'den sonra dünyada İHA teknologisinde üçüncü sıraya yerleşti. 2025 hedefi 5 milyar dolar ihracat olarak belirlendi.`,
    category: "savunma",
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        caption: "Türk yapımı İHA",
        alt: "İnsansız hava aracı teknolojisi"
      }
    ],
    author: "Savunma Editörü",
    source: "NetNext",
    status: "published",
    views: 8940,
    tags: ["iha", "savunma sanayi", "bayraktar", "ihracat"],
    breaking: false,
    urgent: false,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "İstanbul'da Akıllı Şehir Projesi: 5G ile Bağlı Trafik Sistemi",
    summary: "İstanbul Büyükşehir Belediyesi'nin akıllı şehir projesi kapsamında, 5G altyapısıyla bağlı trafik yönetim sistemi hayata geçiyor.",
    content: `İstanbul Büyükşehir Belediyesi, şehrin trafik sorunlarına teknolojik çözüm getiren akıllı trafik yönetim sistemini tanıttı. 5G altyapısı üzerinde çalışan sistem, gerçek zamanlı veri analiziyle trafik akışını optimize ediyor.

İBB Başkanı Ekrem İmamoğlu, "Yapay zeka destekli sistem, trafik yoğunluğunu yüzde 30 azaltacak" açıklamasında bulundu. Projede 15 bin akıllı trafik lambası ve 25 bin sensör kullanılıyor.

Sistem, araç yoğunluğuna göre trafik lambalarının süresini otomatik ayarlıyor. Ayrıca acil durum araçları için yeşil koridor oluşturabiliyor. İlk etapta Şişli, Beşiktaş ve Kadıköy'de aktif olan sistem, 2026'da tüm şehri kapsayacak.`,
    category: "teknoloji",
    images: [
      {
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        caption: "Akıllı şehir trafik sistemleri",
        alt: "5G bağlantılı trafik yönetimi"
      }
    ],
    author: "Şehircilik Editörü",
    source: "NetNext",
    status: "published",
    views: 4560,
    tags: ["akıllı şehir", "5g", "trafik", "istanbul"],
    breaking: false,
    urgent: false,
    featured: false,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "Türkiye'nin İlk Uzay Üssü Sinop'ta Kuruluyor",
    summary: "Sinop'ta kurulan Türkiye Uzay Ajansı üssü, 2026'da ilk uydu fırlatma testlerine başlayacak. Proje, ulusal uzay programının kalbi olacak.",
    content: `Türkiye Uzay Ajansı (TUA), Sinop ilinde kurduğu uzay üssünün inşaat çalışmalarını tamamladı. 500 dönüm alanda kurulan tesis, Türkiye'nin uzay çalışmalarının merkezi haline gelecek.

TUA Başkanı Prof. Dr. Serdar Hüseyin Yıldırım, "2026 yılında yerli uydu fırlatma testlerimizi başlatacağız" dedi. Üs, küçük ve orta ölçekli uyduların fırlatılması için tasarlandı.

Komplekste uydu üretim tesisi, test laboratuvarları ve kontrol merkezi bulunuyor. Ayrıca 50 mühendis ve teknisyenin çalışabileceği araştırma merkezi de inşa edildi. Türkiye'nin 2028 hedefi, ay'a sert iniş yapabilecek aracı göndermek.`,
    category: "bilim",
    images: [
      {
        url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
        caption: "Uzay roketi fırlatma rampası",
        alt: "Türkiye uzay programı"
      }
    ],
    author: "Bilim Editörü",
    source: "NetNext",
    status: "published",
    views: 6230,
    tags: ["uzay", "sinop", "uydu", "tua"],
    breaking: false,
    urgent: false,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "Yenilenebilir Enerji Rekoru: Türkiye Günlük İhtiyacının %85'ini Karşıladı",
    summary: "Rüzgar ve güneş enerjisi üretiminin rekor seviyeye çıktığı günde, Türkiye elektrik ihtiyacının yüzde 85'ini yenilenebilir kaynaklardan karşıladı.",
    content: `Türkiye, yenilenebilir enerji alanında önemli bir rekor kırdı. Güneş ve rüzgar enerjisi üretiminin zirve yaptığı 28 Temmuz tarihinde, ülkenin günlük elektrik ihtiyacının yüzde 85'i temiz kaynaklardan karşılandı.

Enerji ve Tabii Kaynaklar Bakanlığı verilerine göre, bu günde 45 bin MW güneş, 35 bin MW rüzgar enerjisi üretildi. Hidroelektrik santralleriyle birlikte toplam yenilenebilir enerji payı yüzde 85'e ulaştı.

Bakan Alparslan Bayraktar, "2053 net sıfır emisyon hedefimize doğru kararlı adımlarla ilerliyoruz" açıklamasında bulundu. Türkiye'nin kurulu yenilenebilir enerji gücü 60 bin MW'a ulaştı. 2030 hedefi 120 bin MW.`,
    category: "enerji",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=600&fit=crop",
        caption: "Güneş enerjisi santrali",
        alt: "Yenilenebilir enerji üretimi"
      }
    ],
    author: "Enerji Editörü",
    source: "NetNext",
    status: "published",
    views: 7120,
    tags: ["yenilenebilir enerji", "güneş", "rüzgar", "rekor"],
    breaking: false,
    urgent: false,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  }
];

async function addHeadlineNews() {
  try {
    console.log('🚀 8 adet profesyonel manşet haberi ekleniyor...');
    
    for (const news of professionalHeadlineNews) {
      const docRef = await addDoc(collection(db, 'news'), news);
      console.log(`✅ Haber eklendi: ${docRef.id} - ${news.title.substring(0, 50)}...`);
    }
    
    console.log('🎉 Tüm profesyonel manşet haberleri başarıyla eklendi!');
    console.log('📊 Eklenen haber sayısı:', professionalHeadlineNews.length);
    console.log('🏷️ Kategoriler: teknoloji, ekonomi, çevre, eğitim, savunma, bilim, enerji');
    console.log('🖼️ Her haberin profesyonel Unsplash görseli mevcut');
    console.log('📱 HeadlineNewsGrid komponenti bu haberleri otomatik olarak gösterecektir');
    
  } catch (error) {
    console.error('❌ Haber ekleme hatası:', error);
  }
}

// Export for use in other files
export { addHeadlineNews, professionalHeadlineNews };

// Run if this file is executed directly
if (typeof window === 'undefined') {
  addHeadlineNews();
}
