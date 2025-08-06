'use client'

import { useState } from 'react'

export default function AdminTest() {
  const [message, setMessage] = useState('Admin Test Page Loaded!')

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-black mb-4">🚀 ADMIN TEST</h1>
        <p className="text-lg text-gray-700 mb-4">{message}</p>
        <button 
          onClick={() => setMessage('Button clicked! React works!')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Button
        </button>
        <div className="mt-4 text-sm text-gray-600">
          <p>✅ Component mounted</p>
          <p>✅ React hooks working</p>
          <p>✅ Styling applied</p>
          <p>URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
        </div>
      </div>
    </div>
  )
}
