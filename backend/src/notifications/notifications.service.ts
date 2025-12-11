import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    relatedUserId?: string,
    relatedPostId?: string,
    relatedServerId?: string,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      userId,
      type,
      title,
      message,
      link,
      relatedUserId,
      relatedPostId,
      relatedServerId,
      read: false,
    });

    return await this.notificationsRepository.save(notification);
  }

  async findByUser(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const query = this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (unreadOnly) {
      query.andWhere('notification.read = :read', { read: false });
    }

    return await query.getMany();
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.read = true;
    return await this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { userId, read: false },
      { read: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationsRepository.count({
      where: { userId, read: false },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });

    if (notification) {
      await this.notificationsRepository.remove(notification);
    }
  }
}

