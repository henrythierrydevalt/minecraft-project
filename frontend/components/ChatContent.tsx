'use client';

import { useState, useEffect, useRef } from 'react';
import { chatsService, Chat, ChatMessage, ChatRequest } from '@/lib/chats';
import { FaPaperPlane, FaBan, FaVolumeMute, FaVolumeUp, FaCheck, FaTimes } from 'react-icons/fa';
import { useToast } from './ToastProvider';
import { authService } from '@/lib/auth';

export default function ChatContent() {
  const { showToast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      if (selectedChat) {
        loadMessages(selectedChat.id);
      }
      loadChats();
      loadRequests();
    }, 2000); // Polling a cada 2 segundos

    return () => clearInterval(interval);
  }, [selectedChat]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadChats(), loadRequests()]);
    } finally {
      setLoading(false);
    }
  };

  const loadChats = async () => {
    try {
      const data = await chatsService.getChats();
      setChats(data);
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const data = await chatsService.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const data = await chatsService.getMessages(chatId);
      setMessages(data.reverse()); // Reverter para mostrar mais recentes no final
      scrollToBottom();
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    await loadMessages(chat.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await chatsService.sendMessage(selectedChat.id, newMessage);
      setNewMessage('');
      await loadMessages(selectedChat.id);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao enviar mensagem', 'error');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const chat = await chatsService.acceptRequest(requestId);
      showToast('Chat aceito!', 'success');
      await loadData();
      if (chat) {
        handleSelectChat(chat);
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao aceitar', 'error');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await chatsService.rejectRequest(requestId);
      showToast('Solicitação rejeitada', 'info');
      await loadRequests();
    } catch (error: any) {
      showToast('Erro ao rejeitar', 'error');
    }
  };

  const handleBlockChat = async (chatId: string) => {
    if (!confirm('Tem certeza que deseja bloquear este chat?')) return;
    try {
      await chatsService.blockChat(chatId);
      showToast('Chat bloqueado', 'success');
      setSelectedChat(null);
      await loadChats();
    } catch (error: any) {
      showToast('Erro ao bloquear', 'error');
    }
  };

  const handleMuteChat = async (chatId: string) => {
    try {
      await chatsService.muteChat(chatId);
      await loadChats();
      if (selectedChat?.id === chatId) {
        const updated = await chatsService.getChat(chatId);
        setSelectedChat(updated);
      }
    } catch (error: any) {
      showToast('Erro ao mutar/desmutar', 'error');
    }
  };

  const getCurrentUserId = () => {
    const user = authService.getUser();
    return user?.id;
  };

  const getOtherUser = (chat: Chat) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return chat.user2;
    return chat.user1Id === currentUserId ? chat.user2 : chat.user1;
  };

  const isMuted = (chat: Chat) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return false;
    return chat.user1Id === currentUserId ? chat.user1Muted : chat.user2Muted;
  };

  if (loading) {
    return <div className="text-[#e0e0e0] text-center py-8">Carregando...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)]">
      {/* Lista de Chats */}
      <div className="w-full lg:w-80 flex flex-col">
        <div className="minecraft-card p-4 mb-4">
          <h2 className="text-lg font-bold text-[#e0e0e0] mb-3">Chats</h2>
          {requests.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-[#888] mb-2">Solicitações Pendentes</p>
              {requests.map((request) => (
                <div key={request.id} className="bg-[#1a1a1a] p-2 rounded mb-2 flex items-center justify-between gap-2">
                  <span className="text-[#e0e0e0] text-xs truncate">{request.requester.username}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="p-1 bg-[#7cb342] rounded text-white"
                      title="Aceitar"
                    >
                      <FaCheck className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="p-1 bg-red-600 rounded text-white"
                      title="Rejeitar"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="minecraft-card p-2 flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <p className="text-[#888] text-sm text-center py-4">Nenhum chat ativo</p>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => {
                const otherUser = getOtherUser(chat);
                return (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full text-left p-3 rounded border-2 transition-all ${
                      selectedChat?.id === chat.id
                        ? 'bg-[#7cb342] border-black'
                        : 'bg-[#1a1a1a] border-black hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#e0e0e0] font-bold text-sm truncate">{otherUser?.username}</p>
                        <p className="text-[#888] text-xs truncate">{otherUser?.email}</p>
                      </div>
                      {isMuted(chat) && (
                        <FaVolumeMute className="text-[#888] text-xs ml-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 flex flex-col minecraft-card p-4">
        {selectedChat ? (
          <>
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black">
              <div className="flex-1 min-w-0">
                <p className="text-[#e0e0e0] font-bold text-sm md:text-base truncate">
                  {getOtherUser(selectedChat)?.username}
                </p>
                <p className="text-[#888] text-xs truncate">{getOtherUser(selectedChat)?.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMuteChat(selectedChat.id)}
                  className="p-2 bg-[#2a2a2a] rounded border-2 border-black hover:bg-[#3a3a3a]"
                  title={isMuted(selectedChat) ? 'Desmutar' : 'Mutar'}
                >
                  {isMuted(selectedChat) ? (
                    <FaVolumeMute className="text-[#888]" />
                  ) : (
                    <FaVolumeUp className="text-[#7cb342]" />
                  )}
                </button>
                <button
                  onClick={() => handleBlockChat(selectedChat.id)}
                  className="p-2 bg-red-600 rounded border-2 border-black hover:bg-red-700"
                  title="Bloquear"
                >
                  <FaBan className="text-white text-xs" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {messages.map((message) => {
                const currentUserId = getCurrentUserId();
                const isOwnMessage = message.senderId === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-2 rounded border-2 border-black ${
                        isOwnMessage
                          ? 'bg-[#7cb342] text-white'
                          : 'bg-[#2a2a2a] text-[#e0e0e0]'
                      }`}
                    >
                      {!isOwnMessage && (
                        <p className="text-xs font-bold mb-1">{message.sender.username}</p>
                      )}
                      <p className="text-sm break-words">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="minecraft-input flex-1 px-3 md:px-4 py-2 rounded-lg text-sm"
                disabled={selectedChat.status === 'blocked' || isMuted(selectedChat)}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || selectedChat.status === 'blocked' || isMuted(selectedChat)}
                className="minecraft-button px-4 py-2 text-white font-bold rounded-lg disabled:opacity-50"
              >
                <FaPaperPlane />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#888] text-center">Selecione um chat para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}

