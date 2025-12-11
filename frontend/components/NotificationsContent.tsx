'use client';

import { useState, useEffect } from 'react';
import { notificationsService, Notification } from '@/lib/notifications';
import { useRouter } from 'next/navigation';
import { FaHeart, FaComment, FaAt, FaServer, FaCheck, FaTrash, FaCheckDouble } from 'react-icons/fa';
import { useToast } from './ToastProvider';

export default function NotificationsContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getAll(filter === 'unread');
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      loadNotifications();
    } catch (error) {
      showToast('Erro ao marcar notificação', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      showToast('Todas as notificações foram marcadas como lidas', 'success');
      loadNotifications();
    } catch (error) {
      showToast('Erro ao marcar notificações', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsService.delete(id);
      loadNotifications();
    } catch (error) {
      showToast('Erro ao deletar notificação', 'error');
    }
  };

  const handleClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-red-500" />;
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'mention':
        return <FaAt className="text-yellow-500" />;
      case 'server_vote':
        return <FaServer className="text-green-500" />;
      default:
        return <FaCheck className="text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="text-[#e0e0e0] text-center py-8">Carregando notificações...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg border-2 border-black text-sm ${
              filter === 'all'
                ? 'bg-[#7cb342] text-white'
                : 'bg-[#2a2a2a] text-[#e0e0e0] hover:bg-[#3a3a3a]'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg border-2 border-black text-sm ${
              filter === 'unread'
                ? 'bg-[#7cb342] text-white'
                : 'bg-[#2a2a2a] text-[#e0e0e0] hover:bg-[#3a3a3a]'
            }`}
          >
            Não lidas
          </button>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-3 md:px-4 py-2 rounded-lg bg-[#2a2a2a] text-[#e0e0e0] hover:bg-[#3a3a3a] border-2 border-black flex items-center justify-center gap-2 text-sm"
          >
            <FaCheckDouble />
            <span className="hidden sm:inline">Marcar todas como lidas</span>
            <span className="sm:hidden">Marcar todas</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="minecraft-card p-6 md:p-8 text-center">
          <p className="text-[#888] text-base md:text-xl">Nenhuma notificação</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`minecraft-card p-3 md:p-4 cursor-pointer transition-all ${
                !notification.read ? 'bg-[#2a2a2a] border-[#7cb342]' : ''
              }`}
              onClick={() => handleClick(notification)}
            >
              <div className="flex items-start gap-2 md:gap-3">
                <div className="mt-1 text-sm md:text-base">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-[#e0e0e0] font-bold text-sm md:text-base break-words">{notification.title}</h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-[#7cb342] rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-[#c0c0c0] text-xs md:text-sm break-words">{notification.message}</p>
                  <p className="text-[#888] text-xs mt-1">
                    {new Date(notification.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-1 md:gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="p-1.5 md:p-2 hover:bg-[#3a3a3a] rounded"
                      title="Marcar como lida"
                    >
                      <FaCheck className="text-[#7cb342] text-xs md:text-sm" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="p-1.5 md:p-2 hover:bg-[#3a3a3a] rounded"
                    title="Deletar"
                  >
                    <FaTrash className="text-red-500 text-xs md:text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

