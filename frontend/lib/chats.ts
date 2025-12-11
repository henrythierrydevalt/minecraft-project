import api from './api';

export interface Chat {
  id: string;
  user1Id: string;
  user2Id: string;
  user1: any;
  user2: any;
  status: string;
  user1Muted: boolean;
  user2Muted: boolean;
  messages?: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  sender: any;
  chatId: string;
  read: boolean;
  createdAt: string;
}

export interface ChatRequest {
  id: string;
  requesterId: string;
  receiverId: string;
  requester: any;
  receiver: any;
  status: string;
  createdAt: string;
}

export const chatsService = {
  async createRequest(email: string): Promise<ChatRequest> {
    const response = await api.post<ChatRequest>('/chats/request', { email });
    return response.data;
  },

  async acceptRequest(requestId: string): Promise<Chat> {
    const response = await api.post<Chat>(`/chats/requests/${requestId}/accept`);
    return response.data;
  },

  async rejectRequest(requestId: string): Promise<void> {
    await api.post(`/chats/requests/${requestId}/reject`);
  },

  async getRequests(): Promise<ChatRequest[]> {
    const response = await api.get<ChatRequest[]>('/chats/requests');
    return response.data;
  },

  async getChats(): Promise<Chat[]> {
    const response = await api.get<Chat[]>('/chats');
    return response.data;
  },

  async getChat(chatId: string): Promise<Chat> {
    const response = await api.get<Chat>(`/chats/${chatId}`);
    return response.data;
  },

  async getMessages(chatId: string, limit: number = 50): Promise<ChatMessage[]> {
    const response = await api.get<ChatMessage[]>(`/chats/${chatId}/messages?limit=${limit}`);
    return response.data;
  },

  async sendMessage(chatId: string, content: string): Promise<ChatMessage> {
    const response = await api.post<ChatMessage>(`/chats/${chatId}/messages`, { content });
    return response.data;
  },

  async blockChat(chatId: string): Promise<Chat> {
    const response = await api.post<Chat>(`/chats/${chatId}/block`);
    return response.data;
  },

  async blockUser(email: string): Promise<void> {
    await api.post('/chats/block-user', { email });
  },

  async muteChat(chatId: string): Promise<Chat> {
    const response = await api.post<Chat>(`/chats/${chatId}/mute`);
    return response.data;
  },

  async getAllUsers(search?: string): Promise<any[]> {
    const url = search ? `/chats/users/all?search=${encodeURIComponent(search)}` : '/chats/users/all';
    const response = await api.get<any[]>(url);
    return response.data;
  },
};


