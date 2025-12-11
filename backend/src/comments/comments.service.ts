import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/comment/create-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../entities/notification.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private notificationsService: NotificationsService,
    private postsService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto, postId: string, userId: string): Promise<Comment> {
    const existingComment = await this.commentsRepository.findOne({
      where: { postId, authorId: userId },
    });

    if (existingComment) {
      existingComment.content = createCommentDto.content;
      return await this.commentsRepository.save(existingComment);
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      postId,
      authorId: userId,
    });
    const savedComment = await this.commentsRepository.save(comment);

    try {
      const post = await this.postsService.findOne(postId);
      if (post.authorId !== userId) {
        await this.notificationsService.create(
          post.authorId,
          NotificationType.COMMENT,
          'Novo comentário',
          `Alguém comentou no seu post "${post.title}"`,
          `/dashboard?post=${postId}`,
          userId,
          postId,
        );
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }

    return savedComment;
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { postId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new NotFoundException('You can only delete your own comments');
    }

    await this.commentsRepository.remove(comment);
  }
}

