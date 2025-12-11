import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat, ChatStatus } from '../entities/chat.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { ChatRequest, RequestStatus } from '../entities/chat-request.entity';
import { Block } from '../entities/block.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private messagesRepository: Repository<ChatMessage>,
    @InjectRepository(ChatRequest)
    private requestsRepository: Repository<ChatRequest>,
    @InjectRepository(Block)
    private blocksRepository: Repository<Block>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async createRequest(requesterId: string, receiverEmail: string) {
    const receiver = await this.findUserByEmail(receiverEmail);
    if (!receiver) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (requesterId === receiver.id) {
      throw new ConflictException('Você não pode criar um chat consigo mesmo');
    }

    const isBlocked = await this.blocksRepository.findOne({
      where: [
        { blockerId: requesterId, blockedId: receiver.id },
        { blockerId: receiver.id, blockedId: requesterId },
      ],
    });

    if (isBlocked) {
      throw new ForbiddenException('Não é possível criar chat com este usuário');
    }

    const existingRequest = await this.requestsRepository.findOne({
      where: [
        { requesterId, receiverId: receiver.id, status: RequestStatus.PENDING },
        { requesterId: receiver.id, receiverId: requesterId, status: RequestStatus.PENDING },
      ],
    });

    if (existingRequest) {
      throw new ConflictException('Já existe uma solicitação pendente');
    }

    const existingChat = await this.chatsRepository.findOne({
      where: [
        { user1Id: requesterId, user2Id: receiver.id, status: ChatStatus.ACTIVE },
        { user1Id: receiver.id, user2Id: requesterId, status: ChatStatus.ACTIVE },
      ],
    });

    if (existingChat) {
      return existingChat;
    }

    const request = this.requestsRepository.create({
      requesterId,
      receiverId: receiver.id,
      status: RequestStatus.PENDING,
    });

    return await this.requestsRepository.save(request);
  }

  async acceptRequest(requestId: string, userId: string) {
    const request = await this.requestsRepository.findOne({
      where: { id: requestId, receiverId: userId },
    });

    if (!request) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new ConflictException('Solicitação já foi processada');
    }

    request.status = RequestStatus.ACCEPTED;
    await this.requestsRepository.save(request);

    const chat = this.chatsRepository.create({
      user1Id: request.requesterId,
      user2Id: request.receiverId,
      status: ChatStatus.ACTIVE,
    });

    return await this.chatsRepository.save(chat);
  }

  async rejectRequest(requestId: string, userId: string) {
    const request = await this.requestsRepository.findOne({
      where: { id: requestId, receiverId: userId },
    });

    if (!request) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    request.status = RequestStatus.REJECTED;
    return await this.requestsRepository.save(request);
  }

  async getChats(userId: string) {
    return await this.chatsRepository.find({
      where: [
        { user1Id: userId, status: ChatStatus.ACTIVE },
        { user2Id: userId, status: ChatStatus.ACTIVE },
      ],
      relations: ['user1', 'user2', 'messages', 'messages.sender'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getChat(chatId: string, userId: string) {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: ['user1', 'user2'],
    });

    if (!chat) {
      throw new NotFoundException('Chat não encontrado');
    }

    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('Você não tem acesso a este chat');
    }

    return chat;
  }

  async getMessages(chatId: string, userId: string, limit: number = 50) {
    const chat = await this.getChat(chatId, userId);
    
    return await this.messagesRepository.find({
      where: { chatId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async sendMessage(chatId: string, userId: string, content: string) {
    const chat = await this.getChat(chatId, userId);

    if (chat.status === ChatStatus.BLOCKED) {
      throw new ForbiddenException('Chat bloqueado');
    }

    if ((chat.user1Id === userId && chat.user1Muted) || 
        (chat.user2Id === userId && chat.user2Muted)) {
      throw new ForbiddenException('Você está mutado neste chat');
    }

    const message = this.messagesRepository.create({
      chatId,
      senderId: userId,
      content,
      read: false,
    });

    return await this.messagesRepository.save(message);
  }

  async blockChat(chatId: string, userId: string) {
    const chat = await this.getChat(chatId, userId);
    
    chat.status = ChatStatus.BLOCKED;
    chat.blockedBy = userId;
    
    return await this.chatsRepository.save(chat);
  }

  async blockUser(blockerId: string, blockedEmail: string) {
    const blocked = await this.findUserByEmail(blockedEmail);
    if (!blocked) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (blockerId === blocked.id) {
      throw new ConflictException('Você não pode bloquear a si mesmo');
    }

    const existingBlock = await this.blocksRepository.findOne({
      where: { blockerId, blockedId: blocked.id },
    });

    if (existingBlock) {
      return existingBlock;
    }

    const block = this.blocksRepository.create({
      blockerId,
      blockedId: blocked.id,
    });

    await this.chatsRepository.update(
      [
        { user1Id: blockerId, user2Id: blocked.id },
        { user1Id: blocked.id, user2Id: blockerId },
      ],
      { status: ChatStatus.BLOCKED, blockedBy: blockerId },
    );

    return await this.blocksRepository.save(block);
  }

  async muteChat(chatId: string, userId: string) {
    const chat = await this.getChat(chatId, userId);
    
    if (chat.user1Id === userId) {
      chat.user1Muted = !chat.user1Muted;
    } else {
      chat.user2Muted = !chat.user2Muted;
    }
    
    return await this.chatsRepository.save(chat);
  }

  async getRequests(userId: string) {
    return await this.requestsRepository.find({
      where: { receiverId: userId, status: RequestStatus.PENDING },
      relations: ['requester'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllUsers(userId: string, search?: string) {
    const query = this.usersRepository.createQueryBuilder('user')
      .where('user.id != :userId', { userId });

    if (search) {
      query.andWhere(
        '(user.username ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return await query
      .orderBy('user.username', 'ASC')
      .take(50)
      .getMany();
  }
}

