'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authService, User } from '@/lib/auth';
import { FaHome, FaServer, FaEdit, FaUser, FaHammer, FaSignOutAlt, FaBell, FaBars, FaTimes, FaComments } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { notificationsService } from '@/lib/notifications';

export default function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      notificationsService.getUnreadCount().then(setUnreadCount);
      const interval = setInterval(() => {
        notificationsService.getUnreadCount().then(setUnreadCount);
      }, 30000); // Atualizar a cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [user]);

  const menuItems = [
    { href: '/dashboard', label: 'Feed', icon: FaHome },
    { href: '/dashboard/servers', label: 'Servidores', icon: FaServer },
    { href: '/dashboard/create-post', label: 'Criar Post', icon: FaEdit },
    { href: '/dashboard/players', label: 'Jogadores', icon: FaUser },
    { href: '/dashboard/chat', label: 'Chat', icon: FaComments },
    { href: '/dashboard/profile', label: 'Perfil', icon: FaUser },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#2a2a2a] text-[#e0e0e0] p-3 rounded-lg border-2 border-black"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`minecraft-sidebar w-64 h-screen p-4 md:p-6 flex flex-col fixed md:static z-40 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="mb-6 md:mb-8 pb-4 md:pb-6 border-b-2 border-black">
          <div className="flex items-center gap-2 mb-2">
            <FaHammer className="text-[#7cb342] text-xl md:text-2xl" />
            <h1 className="text-xl md:text-2xl font-bold text-[#e0e0e0] drop-shadow-lg">Minecraft</h1>
          </div>
          <p className="text-[#7cb342] text-xs md:text-sm font-semibold">Comunidade</p>
        </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all border-2 text-sm md:text-base ${
                    isActive
                      ? 'bg-[#7cb342] text-white font-bold shadow-lg border-black'
                      : 'text-[#c0c0c0] hover:bg-[#2a2a2a] hover:text-[#e0e0e0] border-transparent hover:border-[#3a3a3a]'
                  }`}
                >
                  <Icon className="mr-2 text-sm md:text-base" />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all border-2 relative text-sm md:text-base ${
                pathname === '/dashboard/notifications'
                  ? 'bg-[#7cb342] text-white font-bold shadow-lg border-black'
                  : 'text-[#c0c0c0] hover:bg-[#2a2a2a] hover:text-[#e0e0e0] border-transparent hover:border-[#3a3a3a]'
              }`}
            >
              <FaBell className="mr-2 text-sm md:text-base" />
              Notificações
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>

      {user && (
        <div className="mt-auto pt-4 md:pt-6 border-t-2 border-black">
          <div className="mb-3 md:mb-4 bg-[#1a1a1a] p-2 md:p-3 rounded border-2 border-black">
            <p className="text-[#7cb342] text-xs md:text-sm font-bold">Jogador</p>
            <p className="text-[#e0e0e0] font-bold text-base md:text-lg truncate">{user.username}</p>
            <p className="text-[#888] text-xs mt-1">
              Nível {user.level} • {user.experience} XP
            </p>
          </div>
          <button
            onClick={() => authService.logout()}
            className="w-full minecraft-button text-white font-bold py-2 px-3 md:px-4 rounded-lg flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <FaSignOutAlt />
            Sair
          </button>
        </div>
      )}
    </aside>
    </>
  );
}
