import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat } from '../entities/chat.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { ChatRequest } from '../entities/chat-request.entity';
import { Block } from '../entities/block.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatMessage, ChatRequest, Block, User]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}

