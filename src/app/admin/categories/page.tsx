import { Metadata } from 'next';
import CategoryManagement from '@/components/admin/CategoryManagement';

export const metadata: Metadata = {
  title: 'Kategori Yönetimi - NetNext Admin',
  description: 'Kategori ve haber eşleştirme yönetim paneli',
};

export default function AdminCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryManagement />
    </div>
  );
}
