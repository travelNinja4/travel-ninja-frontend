import BaseLayout from '@/components/BaseLayout';
import '../page.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}
