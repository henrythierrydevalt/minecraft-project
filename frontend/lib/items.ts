import api from './api';

export interface Item {
  id: string;
  name: string;
  type: string;
  description?: string;
  quantity: number;
  durability: number;
  enchantmentLevel: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDto {
  name: string;
  type: string;
  description?: string;
  quantity?: number;
  durability?: number;
  enchantmentLevel?: number;
}

export interface UpdateItemDto {
  name?: string;
  type?: string;
  description?: string;
  quantity?: number;
  durability?: number;
  enchantmentLevel?: number;
}

export const itemsService = {
  async getAll(): Promise<Item[]> {
    const response = await api.get<Item[]>('/items');
    return response.data;
  },

  async getById(id: string): Promise<Item> {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },

  async create(data: CreateItemDto): Promise<Item> {
    const response = await api.post<Item>('/items', data);
    return response.data;
  },

  async update(id: string, data: UpdateItemDto): Promise<Item> {
    const response = await api.patch<Item>(`/items/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/items/${id}`);
  },
};

