import api from './api';

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDto {
  content: string;
}

export const commentsService = {
  async getByPost(postId: string): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/comments/post/${postId}`);
    return response.data;
  },

  async create(postId: string, data: CreateCommentDto): Promise<Comment> {
    const response = await api.post<Comment>(`/comments/${postId}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/comments/${id}`);
  },
};

