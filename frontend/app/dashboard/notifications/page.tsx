import { Suspense } from 'react';
import NotificationsContent from '@/components/NotificationsContent';
import { FaBell } from 'react-icons/fa';

export default function NotificationsPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#e0e0e0] flex items-center gap-2">
        <FaBell className="text-lg md:text-xl lg:text-2xl" />
        <span>Notificações</span>
      </h1>
      <Suspense fallback={<div className="text-[#e0e0e0] text-center py-8">Carregando...</div>}>
        <NotificationsContent />
      </Suspense>
    </div>
  );
}

