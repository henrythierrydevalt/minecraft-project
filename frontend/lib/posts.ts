import api from './api';

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
  views: number;
  author: {
    id: string;
    username: string;
    email: string;
  };
  authorId: string;
  likes: Array<{ id: string; userId: string }>;
  comments: Array<{ id: string; content: string; author: { username: string } }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  imageUrl?: string;
  category?: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}

export const postsService = {
  async getAll(page: number = 1, limit: number = 10, category?: string): Promise<PostsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (category) params.append('category', category);
    const response = await api.get<PostsResponse>(`/posts?${params}`);
    return response.data;
  },

  async getById(id: string): Promise<Post> {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  async create(data: CreatePostDto): Promise<Post> {
    const response = await api.post<Post>('/posts', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreatePostDto>): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  async getByUser(userId: string): Promise<Post[]> {
    const response = await api.get<Post[]>(`/posts/user/${userId}`);
    return response.data;
  },
};

