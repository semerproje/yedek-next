'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Users, Award, TrendingUp, TrendingDown, Activity, School, Calculator, Globe } from 'lucide-react';

interface EducationKpiData {
  studentSuccessRate: number;
  successChange: number;
  literacyRate: number;
  literacyChange: number;
  universityEnrollment: number;
  enrollmentChange: number;
  teacherStudentRatio: number;
  ratioChange: number;
  lastUpdate: string;
}

const EducationKpiWidget = () => {
  const [kpiData, setKpiData] = useState<EducationKpiData>({
    studentSuccessRate: 0,
    successChange: 0,
    literacyRate: 0,
    literacyChange: 0,
    universityEnrollment: 0,
    enrollmentChange: 0,
    teacherStudentRatio: 0,
    ratioChange: 0,
    lastUpdate: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpiData = () => {
      // Gerçek zamanlı eğitim verilerini simüle et
      const mockKpiData: EducationKpiData = {
        studentSuccessRate: 78.5 + (Math.random() - 0.5) * 3,
        successChange: 2.4 + (Math.random() - 0.5) * 2,
        literacyRate: 96.2 + (Math.random() - 0.5) * 1,
        literacyChange: 0.8 + (Math.random() - 0.5) * 1,
        universityEnrollment: 43.7 + (Math.random() - 0.5) * 2,
        enrollmentChange: 5.2 + (Math.random() - 0.5) * 3,
        teacherStudentRatio: 18.3 + (Math.random() - 0.5) * 2,
        ratioChange: -1.2 + (Math.random() - 0.5) * 1,
        lastUpdate: new Date().toLocaleTimeString('tr-TR')
      };

      setKpiData(mockKpiData);
      setLoading(false);
    };

    fetchKpiData();
    const interval = setInterval(fetchKpiData, 25000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, isDecimal: boolean = true, unit: string = '') => {
    const formatted = isDecimal ? value.toFixed(1) : value.toLocaleString();
    return unit ? `${formatted}${unit}` : formatted;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeColor = (change: number, isReverse: boolean = false) => {
    const positive = isReverse ? change < 0 : change >= 0;
    return positive ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number, isReverse: boolean = false) => {
    const positive = isReverse ? change < 0 : change >= 0;
    return positive ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getSuccessLevel = (rate: number) => {
    if (rate >= 85) return { text: 'Mükemmel', color: 'text-green-600', bg: 'bg-green-50' };
    if (rate >= 75) return { text: 'İyi', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (rate >= 65) return { text: 'Orta', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (rate >= 50) return { text: 'Düşük', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Kritik', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const kpiItems = [
    {
      title: 'Öğrenci Başarı Oranı',
      value: formatValue(kpiData.studentSuccessRate, true, '%'),
      change: formatChange(kpiData.successChange),
      changeColor: getChangeColor(kpiData.successChange),
      icon: Award,
      description: 'Türkiye ortalaması',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      extra: getSuccessLevel(kpiData.studentSuccessRate)
    },
    {
      title: 'Okuma Yazma Oranı',
      value: formatValue(kpiData.literacyRate, true, '%'),
      change: formatChange(kpiData.literacyChange),
      changeColor: getChangeColor(kpiData.literacyChange),
      icon: BookOpen,
      description: '15+ yaş nüfus',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Üniversite Kayıt Oranı',
      value: formatValue(kpiData.universityEnrollment, true, '%'),
      change: formatChange(kpiData.enrollmentChange),
      changeColor: getChangeColor(kpiData.enrollmentChange),
      icon: GraduationCap,
      description: 'Lise mezunları',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Öğretmen/Öğrenci Oranı',
      value: `1:${formatValue(kpiData.teacherStudentRatio, false)}`,
      change: formatChange(kpiData.ratioChange),
      changeColor: getChangeColor(kpiData.ratioChange, true), // Tersine: azalma iyi
      icon: Users,
      description: 'Sınıf başına öğrenci',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <School className="w-6 h-6 text-blue-600" />
          Eğitim Metrikleri
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Son güncelleme: {kpiData.lastUpdate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${item.bgColor} rounded-lg p-2`}>
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="flex items-center gap-1">
                  {getChangeIcon(item.changeColor === 'text-green-600' ? 1 : -1)}
                  <span className={`text-sm font-medium ${item.changeColor}`}>
                    {item.change}
                  </span>
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {item.title}
                </h3>
                <div className="text-2xl font-bold text-gray-900">
                  {item.value}
                </div>
              </div>

              {item.extra && (
                <div className={`${item.extra.bg} ${item.extra.color} px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block`}>
                  {item.extra.text}
                </div>
              )}

              <p className="text-xs text-gray-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Eğitim Seviye Göstergeleri */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <School className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">
              {Math.floor(1840 + Math.random() * 100).toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">Toplam Okul Sayısı</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <Calculator className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">
              {Math.floor(18500 + Math.random() * 500).toLocaleString()}
            </div>
            <div className="text-sm text-purple-700">Sınıf Sayısı</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
            <Globe className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-emerald-600">
              {Math.floor(208 + Math.random() * 10)}
            </div>
            <div className="text-sm text-emerald-700">Üniversite Sayısı</div>
          </div>
        </div>
      </div>

      {/* Eğitim Uyarıları */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          Eğitim Bildirimleri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <h4 className="font-medium text-blue-800">YKS Başvuru Süreci</h4>
            <p className="text-sm text-blue-700">2025 YKS başvuruları için son 3 gün</p>
            <div className="mt-2 text-xs text-blue-600 font-medium">● Kritik süreç</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
            <h4 className="font-medium text-green-800">Dijital Eğitim Projesi</h4>
            <p className="text-sm text-green-700">Yeni tablet dağıtımı başlıyor</p>
            <div className="mt-2 text-xs text-green-600 font-medium">● Pozitif gelişme</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationKpiWidget;
