'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Database, 
  Settings, 
  BarChart3,
  Upload,
  Globe,
  Rss,
  Shield
} from 'lucide-react';

const adminNavigationItems = [
  {
    name: 'Ana Sayfa',
    href: '/admin',
    icon: BarChart3
  },
  {
    name: 'Haber Yönetimi',
    href: '/admin/news',
    icon: FileText
  },
  {
    name: 'NewsML 2.9',
    href: '/admin/newsml29',
    icon: Database
  },
  {
    name: 'AA İçe Aktarma',
    href: '/admin/aa-import',
    icon: Upload
  },
  {
    name: 'Ultra AA Manager',
    href: '/admin/dashboard/ultra-aa-manager',
    icon: Settings
  },
  {
    name: 'Kategori Yönetimi',
    href: '/admin/categories',
    icon: Globe
  },
  {
    name: 'RSS Yönetimi',
    href: '/admin/rss',
    icon: Rss
  },
  {
    name: 'Güvenlik',
    href: '/admin/security',
    icon: Shield
  },
  {
    name: 'Ayarlar',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Ultra Premium</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        
        <nav className="mt-6">
          {adminNavigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {adminNavigationItems.find(item => item.href === pathname)?.name || 'Admin Panel'}
              </h2>
            </div>
            <div className="text-sm text-gray-500">
              NetNext News Yönetim Sistemi
            </div>
          </div>
        </div>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
