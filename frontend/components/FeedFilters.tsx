'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function FeedFilters({
  category: initialCategory,
  search: initialSearch,
}: {
  category: string;
  search: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    router.push(`/dashboard?${params.toString()}`);
  };

  const clearFilters = () => {
    setCategory('');
    setSearch('');
    router.push('/dashboard');
  };

  return (
    <div className="minecraft-card p-3 md:p-4">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888] text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
            placeholder="Buscar posts..."
            className="minecraft-input w-full px-3 md:px-4 py-2 rounded-lg pl-9 md:pl-10 text-sm"
          />
        </div>
        <div className="w-full sm:w-auto sm:min-w-[150px] md:w-48">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="minecraft-input w-full px-3 md:px-4 py-2 rounded-lg text-sm"
          >
            <option value="">Todas as categorias</option>
            <option value="general">Geral</option>
            <option value="builds">Construções</option>
            <option value="redstone">Redstone</option>
            <option value="pvp">PvP</option>
            <option value="servers">Servidores</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="minecraft-button flex-1 sm:flex-none px-4 md:px-6 py-2 text-white font-bold rounded-lg whitespace-nowrap text-sm"
          >
            Filtrar
          </button>
          {(category || search) && (
            <button
              onClick={clearFilters}
              className="bg-[#2a2a2a] px-4 md:px-6 py-2 text-white font-bold rounded-lg border-2 border-black hover:bg-[#3a3a3a] whitespace-nowrap text-sm"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

