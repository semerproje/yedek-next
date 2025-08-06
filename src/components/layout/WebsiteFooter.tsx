import Image from "next/image";
import {
  Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Clock, BookOpen
} from "lucide-react";
import logo from "@/../public/assets/logo.png";

const categories = [
  { label: "Gündem", href: "/kategori/gundem" },
  { label: "Ekonomi", href: "/kategori/ekonomi" },
  { label: "Dünya", href: "/kategori/dunya" },
  { label: "Teknoloji", href: "/kategori/teknoloji" },
  { label: "Spor", href: "/kategori/spor" },
  { label: "Sağlık", href: "/kategori/saglik" },
  { label: "Kültür", href: "/kategori/kultur" },
  { label: "Magazin", href: "/kategori/magazin" },
  { label: "Çevre", href: "/kategori/cevre" },
  { label: "Politika", href: "/kategori/politika" },
  { label: "Eğitim", href: "/kategori/egitim" },
  { label: "Din", href: "/kategori/din" }
];

const navLinks = [
  { href: "/iletisim", label: "İletişim" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/kvkk", label: "KVKK" },
  { href: "/reklam", label: "Reklam" }
];

const appBadges = [
  {
    href: "https://apps.apple.com/app/id0000000000",
    src: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
    alt: "App Store'dan indir"
  },
  {
    href: "https://play.google.com/store/apps/details?id=net.nethaberler.app",
    src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
    alt: "Google Play'den indir"
  }
];

export default function WebsiteFooter() {
  return (
    <footer className="w-full bg-gradient-to-br from-[#1c1e25] via-[#222531] to-[#151720] border-t border-white/10 pt-10 pb-3 mt-16 font-[Inter,Segoe UI,sans-serif] text-[15px]">
      <div className="container mx-auto px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
        {/* 1. LOGO & MARKA */}
        <div className="rounded-2xl bg-white/10 shadow-xl border border-white/20 p-6 flex flex-col items-center justify-between min-h-[180px] hover:shadow-2xl transition">
          <Image
            src={logo}
            alt="Net Haberler"
            className="h-14 w-auto mb-4 select-none"
            style={{ background: "none", borderRadius: 0, boxShadow: "none", border: "none", objectFit: "contain", width: "auto", height: "auto" }}
            draggable={false}
            width={120}
            height={56}
            priority
          />
          <div className="text-sm font-extrabold text-white/90 text-center mb-1 tracking-wide drop-shadow">
            © {new Date().getFullYear()} Net Haberler
          </div>
          <div className="text-[13px] text-gray-300 font-medium text-center">
            Tarafsız & hızlı haberin yeni adresi.
          </div>
        </div>
        {/* 2. KATEGORİLER */}
        <div className="rounded-2xl bg-white/10 shadow-xl border border-white/20 p-6 flex flex-col min-h-[180px]">
          <div className="font-semibold text-white mb-2 flex items-center gap-1">
            <BookOpen size={17} /> Kategoriler
          </div>
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {categories.slice(0, 6).map(cat => (
              <a key={cat.href} href={cat.href} className="text-gray-200 hover:text-blue-400 hover:translate-x-1 transition-all">{cat.label}</a>
            ))}
            <a href="/kategoriler" className="text-blue-300 hover:underline text-xs mt-2">Tüm kategoriler</a>
          </nav>
        </div>
        {/* 3. KÜNYE & VİZYON */}
        <div className="rounded-2xl bg-white/10 shadow-xl border border-white/20 p-6 flex flex-col min-h-[180px]">
          <div className="font-semibold text-white mb-2">Künye & Vizyon</div>
          <div className="text-xs text-gray-300 leading-snug mb-2">
            <b>Misyon:</b> Tarafsız, hızlı ve doğru habercilik.<br />
            <b>Vizyon:</b> Dijitalde Türkiye’nin en güvenilir haber kaynağı.<br />
            <b>Yayın Yönetmeni:</b> <span className="text-white/90">Burak Erdem</span>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin size={12} /> İstanbul, Türkiye
          </div>
        </div>
        {/* 4. KURUMSAL MENÜ */}
        <div className="rounded-2xl bg-white/10 shadow-xl border border-white/20 p-6 flex flex-col min-h-[180px]">
          <div className="font-semibold text-white mb-2">Kurumsal</div>
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-gray-200 hover:text-blue-300 transition-all hover:translate-x-1"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        {/* 5. MOBİL UYGULAMA */}
        <div className="rounded-2xl bg-white/10 shadow-xl border border-white/20 p-6 flex flex-col items-center min-h-[180px]">
          <div className="font-semibold text-white mb-2">Uygulamalar</div>
          <div className="flex flex-col gap-2 items-center">
            {appBadges.map(badge => (
              <a key={badge.href} href={badge.href} target="_blank" rel="noopener" className="block hover:scale-105 transition-all">
                <img
                  src={badge.src}
                  alt={badge.alt}
                  className="h-8 w-auto rounded"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            iOS & Android’de Net Haberler!
          </div>
        </div>
        {/* 6. SOSYAL & DUYURU */}
        <div className="rounded-2xl bg-white/10 shadow-xl border border-white/20 p-6 flex flex-col items-center min-h-[180px]">
          <div className="font-semibold text-white mb-2">Bizi Takip Edin</div>
          <div className="flex gap-2 mb-2">
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"
              className="rounded-full p-1 bg-white/10 text-gray-200 hover:text-white hover:bg-blue-600/80 transition-all shadow">
              <Facebook size={15} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"
              className="rounded-full p-1 bg-white/10 text-gray-200 hover:text-white hover:bg-pink-500/80 transition-all shadow">
              <Instagram size={15} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter"
              className="rounded-full p-1 bg-white/10 text-gray-200 hover:text-white hover:bg-sky-500/80 transition-all shadow">
              <Twitter size={15} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="Linkedin"
              className="rounded-full p-1 bg-white/10 text-gray-200 hover:text-white hover:bg-blue-400/80 transition-all shadow">
              <Linkedin size={15} />
            </a>
            <a href="mailto:info@nethaberler.com" aria-label="Mail"
              className="rounded-full p-1 bg-white/10 text-gray-200 hover:text-white hover:bg-amber-400/80 transition-all shadow">
              <Mail size={15} />
            </a>
          </div>
          <div className="mt-1 text-[11px] text-gray-400 text-center leading-4">
            <Clock size={10} className="inline-block mr-1 -mt-1" />
            <span className="font-semibold text-amber-300">Yapay zeka</span> & <span className="font-semibold text-blue-300">insan editör</span> işbirliği.<br />
            <span className="text-gray-500">Geliştirme: <a href="https://www.semer.com.tr" target="_blank" rel="noopener" className="underline hover:text-blue-400">semer.com.tr</a></span>
          </div>
        </div>
      </div>
      {/* Alt Bant */}
      <div className="mt-8 text-center">
        <span className="inline-block px-3 py-1 rounded-xl bg-gradient-to-r from-blue-700 via-fuchsia-600 to-pink-500 text-white/90 shadow font-bold text-sm tracking-wider">
          Ultra Premium Altyapı
        </span>
      </div>
    </footer>
  );
}
