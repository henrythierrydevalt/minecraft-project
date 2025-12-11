import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../entities/notification.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private notificationsService: NotificationsService,
    private postsService: PostsService,
  ) {}

  async toggle(postId: string, userId: string): Promise<{ liked: boolean }> {
    const existingLike = await this.likesRepository.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      return { liked: false };
    } else {
      const like = this.likesRepository.create({ postId, userId });
      await this.likesRepository.save(like);

      try {
        const post = await this.postsService.findOne(postId);
        if (post.authorId !== userId) {
          await this.notificationsService.create(
            post.authorId,
            NotificationType.LIKE,
            'Nova curtida',
            `Alguém curtiu seu post "${post.title}"`,
            `/dashboard?post=${postId}`,
            userId,
            postId,
          );
        }
      } catch (error) {
        console.error('Error creating notification:', error);
      }

      return { liked: true };
    }
  }

  async count(postId: string): Promise<number> {
    return await this.likesRepository.count({ where: { postId } });
  }

  async isLiked(postId: string, userId: string): Promise<boolean> {
    const like = await this.likesRepository.findOne({
      where: { postId, userId },
    });
    return !!like;
  }
}

