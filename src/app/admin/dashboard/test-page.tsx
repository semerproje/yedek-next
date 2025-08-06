export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          🎉 Dashboard Test Sayfası
        </h1>
        <p className="text-blue-800 text-xl mb-8">
          Bu sayfa görünüyorsa, routing çalışıyor demektir!
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Bilgileri:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Next.js routing çalışıyor</li>
            <li>✅ Tailwind CSS yüklü</li>
            <li>✅ Component render oluyor</li>
            <li>✅ Admin dashboard erişilebilir</li>
          </ul>
        </div>

        <div className="bg-green-100 border border-green-400 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ✨ Eğer bu sayfayı görüyorsanız, temel sistem çalışıyor!
          </p>
          <p className="text-green-700 text-sm mt-2">
            Şimdi gerçek dashboard'ı aktif edebiliriz.
          </p>
        </div>

        <button 
          onClick={() => window.location.href = '/admin'}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Admin Login'e Dön
        </button>
      </div>
    </div>
  )
}
