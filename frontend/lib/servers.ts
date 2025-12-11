import api from './api';

export interface Server {
  id: string;
  name: string;
  address: string;
  port: number;
  description?: string;
  bannerUrl?: string;
  version?: string;
  onlinePlayers: number;
  maxPlayers: number;
  isOnline: boolean;
  gamemode: string;
  votes: number;
  owner: {
    id: string;
    username: string;
  };
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServerDto {
  name: string;
  address: string;
  port?: number;
  description?: string;
  bannerUrl?: string;
  version?: string;
  gamemode?: string;
}

export const serversService = {
  async getAll(): Promise<Server[]> {
    const response = await api.get<Server[]>('/servers');
    return response.data;
  },

  async getById(id: string): Promise<Server> {
    const response = await api.get<Server>(`/servers/${id}`);
    return response.data;
  },

  async create(data: CreateServerDto): Promise<Server> {
    const response = await api.post<Server>('/servers', data);
    return response.data;
  },

  async updateStatus(id: string): Promise<Server> {
    const response = await api.patch<Server>(`/servers/${id}/status`);
    return response.data;
  },

  async vote(id: string): Promise<Server> {
    const response = await api.post<Server>(`/servers/${id}/vote`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/servers/${id}`);
  },
};

