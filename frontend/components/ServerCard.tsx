'use client';

import { useState } from 'react';
import { voteServer, updateServerStatus } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { FaSync, FaStar, FaGlobe, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ServerCard({ server }: { server: any }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await updateServerStatus(server.id);
      router.refresh();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVote = async () => {
    try {
      await voteServer(server.id);
      router.refresh();
    } catch (error) {
      console.error('Erro ao votar:', error);
    }
  };

  const displayAddress = server.port === 25565 || !server.port
    ? (server.address || '')
    : `${server.address || ''}:${server.port || 25565}`;

  return (
    <div className="minecraft-block p-4 md:p-6">
      <img
        src={server.bannerUrl || 'https://staticg.sportskeeda.com/editor/2025/01/8827f-17376979472538-1920.jpg'}
        alt={server.name}
        className="w-full h-24 md:h-32 object-cover rounded-lg mb-4 border-2 border-black"
      />
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-[#e0e0e0] font-bold text-lg md:text-xl mb-2 break-words">{server.name || 'Servidor sem nome'}</h3>
          <p className="text-[#7cb342] text-xs md:text-sm font-mono break-all">
            {displayAddress || 'Endereço não disponível'}
          </p>
          {/* Mostrar se é domínio ou IP */}
          {server.address && server.address.includes('.') && !server.address.match(/^\d+\.\d+\.\d+\.\d+$/) && (
            <p className="text-[#7cb342] text-xs mt-1 flex items-center gap-1">
              <FaGlobe />
              Domínio
            </p>
          )}
        </div>
        <div
          className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm font-bold flex items-center gap-1 self-start sm:self-auto ${
            server.isOnline === true
              ? 'bg-[#7cb342] text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {server.isOnline === true ? <FaCheckCircle className="text-xs" /> : <FaTimesCircle className="text-xs" />}
          <span>{server.isOnline === true ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {server.description && (
        <p className="text-[#c0c0c0] text-xs md:text-sm mb-4 break-words">{String(server.description)}</p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-[#888]">Jogadores:</span>
          <span className="text-[#e0e0e0] font-bold">
            {server.onlinePlayers ?? 0}/{server.maxPlayers ?? 0}
          </span>
        </div>
        {server.version && (
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-[#888]">Versão:</span>
            <span className="text-[#e0e0e0] break-words">{String(server.version)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-[#888]">Gamemode:</span>
          <span className="text-[#e0e0e0] capitalize">{server.gamemode || 'survival'}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-[#888]">Votos:</span>
          <span className="text-[#e0e0e0] font-bold flex items-center gap-1">
            <FaStar className="text-yellow-500 text-xs" />
            {server.votes ?? 0}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleUpdateStatus}
          disabled={isUpdating}
          className="flex-1 bg-[#2a2a2a] text-[#e0e0e0] font-bold py-2 px-3 md:px-4 rounded-lg hover:bg-[#3a3a3a] border-2 border-black text-xs md:text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FaSync className={`text-xs ${isUpdating ? 'animate-spin' : ''}`} />
          <span>{isUpdating ? 'Atualizando...' : 'Atualizar'}</span>
        </button>
        <button
          onClick={handleVote}
          className="flex-1 minecraft-button text-white font-bold py-2 px-3 md:px-4 rounded-lg text-xs md:text-sm flex items-center justify-center gap-2"
        >
          <FaStar className="text-xs" />
          <span>Votar</span>
        </button>
      </div>
    </div>
  );
}

