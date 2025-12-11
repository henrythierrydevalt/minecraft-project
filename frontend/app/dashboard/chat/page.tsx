import { Suspense } from 'react';
import ChatContent from '@/components/ChatContent';

export default function ChatPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#e0e0e0] flex items-center gap-2">
        <span>💬 Chat</span>
      </h1>
      <Suspense fallback={<div className="text-[#e0e0e0] text-center py-8">Carregando...</div>}>
        <ChatContent />
      </Suspense>
    </div>
  );
}


