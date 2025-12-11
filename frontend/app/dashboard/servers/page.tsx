import { Suspense } from 'react';
import { getServers } from '@/lib/server-api';
import ServersList from '@/components/ServersList';
import { FaServer } from 'react-icons/fa';

export default async function ServersPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#e0e0e0] flex items-center gap-2">
          <FaServer className="text-lg md:text-xl lg:text-2xl" />
          <span className="hidden sm:inline">Servidores Minecraft</span>
          <span className="sm:hidden">Servidores</span>
        </h1>
      </div>

      <Suspense fallback={<div className="text-[#e0e0e0] text-center py-8">Carregando servidores...</div>}>
        <ServersList />
      </Suspense>
    </div>
  );
}
