'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { itemsService, Item, CreateItemDto } from '@/lib/items';

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateItemDto>({
    name: '',
    type: '',
    description: '',
    quantity: 1,
    durability: 100,
    enchantmentLevel: 0,
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await itemsService.getAll();
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await itemsService.create(formData);
      setShowModal(false);
      setFormData({
        name: '',
        type: '',
        description: '',
        quantity: 1,
        durability: 100,
        enchantmentLevel: 0,
      });
      loadItems();
    } catch (error) {
      console.error('Erro ao criar item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este item?')) {
      try {
        await itemsService.delete(id);
        loadItems();
      } catch (error) {
        console.error('Erro ao deletar item:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-white">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">🎒 Inventário</h1>
        <button
          onClick={() => setShowModal(true)}
          className="minecraft-button text-white font-bold py-2 px-6 rounded-lg"
        >
          ➕ Adicionar Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="minecraft-card p-8 text-center">
          <p className="text-yellow-200 text-xl mb-4">Seu inventário está vazio!</p>
          <button
            onClick={() => setShowModal(true)}
            className="minecraft-button text-white font-bold py-2 px-6 rounded-lg"
          >
            Adicionar Primeiro Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="minecraft-block p-6">
              <h3 className="text-white font-bold text-xl mb-2">{item.name}</h3>
              <p className="text-yellow-200 text-sm mb-2">Tipo: {item.type}</p>
              {item.description && (
                <p className="text-yellow-300 text-xs mb-3">{item.description}</p>
              )}
              <div className="space-y-1 mb-4">
                <p className="text-white text-sm">Quantidade: {item.quantity}</p>
                <p className="text-white text-sm">Durabilidade: {item.durability}</p>
                {item.enchantmentLevel > 0 && (
                  <p className="text-purple-300 text-sm">
                    ✨ Encantamento: Nível {item.enchantmentLevel}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 border-2 border-black"
              >
                🗑️ Deletar
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="minecraft-card p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Adicionar Item</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="minecraft-input w-full px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-white font-bold mb-2">Tipo</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="minecraft-input w-full px-4 py-2 rounded-lg"
                  placeholder="Ex: Espada, Machado, Picareta"
                />
              </div>
              <div>
                <label className="block text-white font-bold mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="minecraft-input w-full px-4 py-2 rounded-lg"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white font-bold mb-2">Quantidade</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                    }
                    min="1"
                    className="minecraft-input w-full px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-2">Durabilidade</label>
                  <input
                    type="number"
                    value={formData.durability}
                    onChange={(e) =>
                      setFormData({ ...formData, durability: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                    className="minecraft-input w-full px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-2">Encantamento</label>
                  <input
                    type="number"
                    value={formData.enchantmentLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enchantmentLevel: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="minecraft-input w-full px-4 py-2 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="minecraft-button flex-1 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Criar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg border-2 border-black hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

