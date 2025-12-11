import api from './api';

export interface Tag {
  id: string;
  name: string;
  usageCount: number;
  createdAt: string;
}

export const tagsService = {
  async getAll(): Promise<Tag[]> {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  },

  async search(query: string): Promise<Tag[]> {
    const response = await api.get<Tag[]>(`/tags/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

