'use client';

import { useState } from 'react';
import { createServer } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function AddServerButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createServer(formData);
      setShowModal(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="minecraft-button text-white font-bold py-2 px-4 md:px-6 rounded-lg text-sm md:text-base"
      >
        Adicionar Servidor
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="minecraft-card p-4 md:p-6 w-full max-w-md my-4">
            <h2 className="text-xl md:text-2xl font-bold text-[#e0e0e0] mb-4">Adicionar Servidor</h2>
            {error && (
              <div className="bg-red-600 text-white p-3 rounded border-2 border-black mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Nome do Servidor</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="minecraft-input w-full px-3 md:px-4 py-2 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Endereço (IP ou Domínio)</label>
                <input
                  type="text"
                  name="address"
                  required
                  className="minecraft-input w-full px-3 md:px-4 py-2 rounded-lg text-sm"
                  placeholder="mushmc.com.br ou 192.168.1.1"
                />
                <p className="text-[#7cb342] text-xs mt-1">
                  Você pode usar domínios (ex: mushmc.com.br) ou IPs diretos
                </p>
              </div>
              <div>
                <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Porta</label>
                <input
                  type="number"
                  name="port"
                  defaultValue={25565}
                  className="minecraft-input w-full px-3 md:px-4 py-2 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Descrição</label>
                <textarea
                  name="description"
                  className="minecraft-input w-full px-3 md:px-4 py-2 rounded-lg text-sm resize-y"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Gamemode</label>
                <select
                  name="gamemode"
                  defaultValue="survival"
                  className="minecraft-input w-full px-3 md:px-4 py-2 rounded-lg text-sm"
                >
                  <option value="survival">Survival</option>
                  <option value="creative">Creative</option>
                  <option value="pvp">PvP</option>
                  <option value="minigames">Minigames</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="minecraft-button flex-1 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 text-sm"
                >
                  {loading ? 'Criando...' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[#2a2a2a] text-[#e0e0e0] font-bold py-2 px-4 rounded-lg border-2 border-black hover:bg-[#3a3a3a] text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

