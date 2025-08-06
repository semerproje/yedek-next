// components/CropDialog.tsx

import React, { useState } from "react";

interface CropDialogProps {
  cropModal: {
    open: boolean;
    imageIdx: number | null;
    platform: string | null;
    crop: { x: number; y: number };
    zoom: number;
    aspect: number;
    imageUrl: string;
    loading: boolean;
  };
  setCropModal: (modal: any) => void;
  handleCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
}

export default function CropDialog({ cropModal, setCropModal, handleCropComplete }: CropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  if (!cropModal.open) return null;

  const handleSave = () => {
    // Basit crop area hesaplama
    const croppedAreaPixels = {
      x: crop.x,
      y: crop.y,
      width: 300 / zoom,
      height: 300 / zoom / cropModal.aspect
    };
    handleCropComplete(null, croppedAreaPixels);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-w-full">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          ✂️ Görseli Kırp & Boyutlandır
        </h2>
        <div className="text-sm text-gray-600 mb-3">
          Platform: <span className="font-medium capitalize">{cropModal.platform}</span>
          {cropModal.platform && (
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
              {cropModal.platform === 'facebook' ? '1200×630' : 
               cropModal.platform === 'twitter' ? '1200×675' : 
               cropModal.platform === 'instagram' ? '1080×1080' : 
               cropModal.platform === 'linkedin' ? '1200×627' : 
               cropModal.platform === 'whatsapp' ? '1080×1080' : 'Custom'}
            </span>
          )}
        </div>
        
        <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden mb-4">
          <img
            src={cropModal.imageUrl}
            alt="Crop preview"
            className="w-full h-full object-contain"
            style={{
              transform: `scale(${zoom}) translate(${crop.x}px, ${crop.y}px)`,
              transformOrigin: 'center'
            }}
          />
          
          {/* Crop overlay */}
          <div 
            className="absolute border-2 border-white shadow-lg"
            style={{
              top: '50%',
              left: '50%',
              width: '200px',
              height: `${200 / cropModal.aspect}px`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          >
            <div className="w-full h-full border border-dashed border-blue-500 bg-transparent"></div>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium w-24">Yakınlaştır:</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-12">{zoom.toFixed(1)}x</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium w-24">Yatay:</span>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={crop.x}
              onChange={e => setCrop(prev => ({ ...prev, x: Number(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-12">{crop.x}px</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium w-24">Dikey:</span>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={crop.y}
              onChange={e => setCrop(prev => ({ ...prev, y: Number(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-12">{crop.y}px</span>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-800 transition disabled:opacity-50"
            onClick={handleSave}
            disabled={cropModal.loading}
          >
            {cropModal.loading ? '⏳ Kaydediliyor...' : '💾 Kaydet'}
          </button>
          <button 
            className="bg-gray-300 px-4 py-2 rounded font-medium shadow hover:bg-gray-400 transition disabled:opacity-50"
            onClick={() => setCropModal((modal: any) => ({ ...modal, open: false }))}
            disabled={cropModal.loading}
          >
            ❌ Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}
