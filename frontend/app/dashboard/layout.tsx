import { redirect } from 'next/navigation';
import { getUser } from '@/lib/server-api';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await getUser();
    
    if (!user) {
      redirect('/login');
    }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full overflow-x-hidden pt-16 md:pt-4">{children}</main>
    </div>
  );
  } catch (error) {
    console.error('Error in dashboard layout:', error);
    redirect('/login');
  }
}

