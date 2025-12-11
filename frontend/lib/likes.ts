import api from './api';

export const likesService = {
  async toggle(postId: string): Promise<{ liked: boolean }> {
    const response = await api.post<{ liked: boolean }>(`/likes/post/${postId}`);
    return response.data;
  },

  async getCount(postId: string): Promise<number> {
    try {
      const response = await api.get<{ count: number }>(`/likes/post/${postId}/count`);
      return response.data.count || 0;
    } catch {
      return 0;
    }
  },

  async isLiked(postId: string): Promise<boolean> {
    try {
      const response = await api.get<{ liked: boolean }>(`/likes/post/${postId}/status`);
      return response.data.liked || false;
    } catch {
      return false;
    }
  },
};

