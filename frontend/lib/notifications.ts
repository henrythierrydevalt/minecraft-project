import api from './api';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  MENTION = 'mention',
  SERVER_VOTE = 'server_vote',
  POST_APPROVED = 'post_approved',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  userId: string;
  relatedUserId?: string;
  relatedPostId?: string;
  relatedServerId?: string;
  createdAt: string;
}

export const notificationsService = {
  async getAll(unreadOnly: boolean = false): Promise<Notification[]> {
    const response = await api.get<Notification[]>(
      `/notifications${unreadOnly ? '?unreadOnly=true' : ''}`
    );
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/notifications/count');
    return response.data.count || 0;
  },

  async markAsRead(id: string): Promise<void> {
    await api.post(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};

