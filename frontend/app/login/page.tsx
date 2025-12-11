'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      authService.setAuth(response.access_token, response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="minecraft-card p-4 md:p-6 lg:p-8 w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#e0e0e0] mb-2">Minecraft</h1>
          <p className="text-[#7cb342] text-sm md:text-base">Entre no seu mundo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {error && (
            <div className="bg-red-600 text-white p-3 rounded border-2 border-black text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="minecraft-input w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-[#e0e0e0] font-bold mb-2 text-sm md:text-base">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="minecraft-input w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="minecraft-button w-full text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg disabled:opacity-50 text-sm md:text-base"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 md:mt-6 text-center">
          <p className="text-[#888] text-sm md:text-base">
            Não tem conta?{' '}
            <Link href="/register" className="text-[#7cb342] font-bold hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
