import { Metadata } from 'next';
import WebsiteLayout from '@/components/layout/WebsiteLayout';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: {
    categorySlug: string;
  };
}

export default function CategoryLayout({ children, params }: CategoryLayoutProps) {
  return (
    <WebsiteLayout>
      {children}
    </WebsiteLayout>
  );
}
