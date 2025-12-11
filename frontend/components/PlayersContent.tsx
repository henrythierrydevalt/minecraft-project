'use client';

import { useState, useEffect } from 'react';
import { chatsService } from '@/lib/chats';
import { FaSearch, FaEnvelope, FaUser } from 'react-icons/fa';

export default function PlayersContent() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await chatsService.getAllUsers(search || undefined);
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = async (email: string) => {
    try {
      await chatsService.createRequest(email);
      alert('Solicitação de chat enviada!');
      setEmailInput('');
      setShowEmailInput(false);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao criar chat');
    }
  };

  if (loading) {
    return <div className="text-[#e0e0e0] text-center py-8">Carregando jogadores...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="minecraft-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888] text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar jogadores..."
              className="minecraft-input w-full px-3 md:px-4 py-2 rounded-lg pl-9 md:pl-10 text-sm"
            />
          </div>
          <button
            onClick={() => setShowEmailInput(!showEmailInput)}
            className="minecraft-button px-4 py-2 text-white font-bold rounded-lg text-sm whitespace-nowrap"
          >
            <FaEnvelope className="inline mr-2" />
            Novo Chat
          </button>
        </div>

        {showEmailInput && (
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Digite o email do jogador..."
              className="minecraft-input flex-1 px-3 md:px-4 py-2 rounded-lg text-sm"
              onKeyPress={(e) => e.key === 'Enter' && emailInput && handleCreateChat(emailInput)}
            />
            <button
              onClick={() => emailInput && handleCreateChat(emailInput)}
              className="minecraft-button px-4 py-2 text-white font-bold rounded-lg text-sm"
            >
              Enviar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="minecraft-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#7cb342] rounded-full flex items-center justify-center text-white font-bold">
                <FaUser />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#e0e0e0] font-bold text-sm md:text-base truncate">{user.username}</p>
                <p className="text-[#888] text-xs truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCreateChat(user.email)}
                className="flex-1 minecraft-button text-white font-bold py-2 px-3 rounded-lg text-xs md:text-sm"
              >
                <FaEnvelope className="inline mr-1" />
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="minecraft-card p-8 text-center">
          <p className="text-[#888] text-lg">Nenhum jogador encontrado</p>
        </div>
      )}
    </div>
  );
}


