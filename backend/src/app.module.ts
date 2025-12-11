import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { PostsModule } from './posts/posts.module';
import { ServersModule } from './servers/servers.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { TagsModule } from './tags/tags.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatsModule } from './chats/chats.module';
import { User } from './entities/user.entity';
import { Item } from './entities/item.entity';
import { Post } from './entities/post.entity';
import { Server } from './entities/server.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Tag } from './entities/tag.entity';
import { Notification } from './entities/notification.entity';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRequest } from './entities/chat-request.entity';
import { Block } from './entities/block.entity';
import { PostView } from './entities/post-view.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'postgres',
        database: configService.get('DB_NAME') || 'minecraft_db',
        entities: [User, Item, Post, Server, Comment, Like, Tag, Notification, Chat, ChatMessage, ChatRequest, Block, PostView],
        synchronize: true, // Auto-create tables (use migrations in production)
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ItemsModule,
    PostsModule,
    ServersModule,
    CommentsModule,
    LikesModule,
    TagsModule,
    NotificationsModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
