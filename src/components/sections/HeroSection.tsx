import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Net Haberler
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Türkiye'nin en güncel haber platformu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/haberler" 
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Haberleri İncele
            </Link>
            <Link 
              href="/analiz" 
              className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Analizleri Oku
            </Link>
          </div>
        </div>
        
        {/* Featured news preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors">
              <div className="h-32 bg-white/20 rounded-md mb-4"></div>
              <h3 className="font-semibold mb-2">Öne Çıkan Haber {item}</h3>
              <p className="text-sm opacity-80">Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
