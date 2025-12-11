import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from '../entities/comment.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), NotificationsModule, PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

