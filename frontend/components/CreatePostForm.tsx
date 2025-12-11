'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/lib/actions';
import { useToast } from './ToastProvider';
import { tagsService } from '@/lib/tags';
import { FaTag, FaTimes } from 'react-icons/fa';

export default function CreatePostForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (tagInput.length > 1) {
      tagsService.search(tagInput).then((results) => {
        setSuggestions(results.map((t) => t.name));
      });
    } else {
      setSuggestions([]);
    }
  }, [tagInput]);

  const addTag = (tag: string) => {
    const normalized = tag.toLowerCase().trim().replace(/#/g, '');
    if (normalized && !tags.includes(normalized)) {
      setTags([...tags, normalized]);
      setTagInput('');
      setSuggestions([]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      tags.forEach((tag) => {
        formData.append('tags[]', tag);
      });
      await createPost(formData);
      showToast('Post criado com sucesso! 🎉', 'success');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao criar post';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="minecraft-card p-4 md:p-6">
      {error && (
        <div className="bg-red-600 text-white p-3 rounded border-2 border-black mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Título</label>
          <input
            type="text"
            name="title"
            required
            className="minecraft-input w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm"
            placeholder="Digite o título do post..."
          />
        </div>

        <div>
          <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Categoria</label>
          <select
            name="category"
            defaultValue="general"
            className="minecraft-input w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm"
          >
            <option value="general">Geral</option>
            <option value="builds">Construções</option>
            <option value="redstone">Redstone</option>
            <option value="pvp">PvP</option>
            <option value="servers">Servidores</option>
          </select>
        </div>

        <div>
          <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Conteúdo</label>
          <textarea
            name="content"
            required
            rows={8}
            className="minecraft-input w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm resize-y"
            placeholder="Escreva seu post aqui..."
          />
        </div>

        <div>
          <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">URL da Imagem (opcional)</label>
          <input
            type="url"
            name="imageUrl"
            className="minecraft-input w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div>
          <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Tags (opcional)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-[#7cb342] text-white px-2 md:px-3 py-1 rounded border border-black text-xs"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-300"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="minecraft-input w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm"
              placeholder="Digite uma tag e pressione Enter..."
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border-2 border-black rounded-lg max-h-40 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTag(suggestion)}
                    className="w-full text-left px-3 md:px-4 py-2 hover:bg-[#3a3a3a] text-[#e0e0e0] flex items-center gap-2 text-sm"
                  >
                    <FaTag className="text-[#7cb342] text-xs" />
                    #{suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="minecraft-button flex-1 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg disabled:opacity-50 text-sm md:text-base"
          >
            {loading ? 'Publicando...' : 'Publicar Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-[#2a2a2a] text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg border-2 border-black hover:bg-[#3a3a3a] text-sm md:text-base"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

