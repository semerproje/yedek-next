import { Metadata } from 'next';
import CategoryManagement from '@/components/admin/CategoryManagement';

export const metadata: Metadata = {
  title: 'Kategori Yönetimi - NetNext Admin Dashboard',
  description: 'Kategori ve haber eşleştirme yönetim paneli',
};

export default function AdminDashboardCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <nav className="text-sm text-gray-600">
          <span>Admin Dashboard</span> 
          <span className="mx-2">/</span> 
          <span className="text-gray-900 font-medium">Kategori Yönetimi</span>
        </nav>
      </div>
      <CategoryManagement />
    </div>
  );
}
