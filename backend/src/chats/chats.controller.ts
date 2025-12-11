import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('request')
  createRequest(@Request() req: any, @Body('email') email: string) {
    return this.chatsService.createRequest(req.user.userId || req.user.id, email);
  }

  @Post('requests/:id/accept')
  acceptRequest(@Param('id') id: string, @Request() req: any) {
    return this.chatsService.acceptRequest(id, req.user.userId || req.user.id);
  }

  @Post('requests/:id/reject')
  rejectRequest(@Param('id') id: string, @Request() req: any) {
    return this.chatsService.rejectRequest(id, req.user.userId || req.user.id);
  }

  @Get('requests')
  getRequests(@Request() req: any) {
    return this.chatsService.getRequests(req.user.userId || req.user.id);
  }

  @Get()
  getChats(@Request() req: any) {
    return this.chatsService.getChats(req.user.userId || req.user.id);
  }

  @Get(':id')
  getChat(@Param('id') id: string, @Request() req: any) {
    return this.chatsService.getChat(id, req.user.userId || req.user.id);
  }

  @Get(':id/messages')
  getMessages(
    @Param('id') id: string,
    @Request() req: any,
    @Query('limit') limit?: string,
  ) {
    return this.chatsService.getMessages(id, req.user.userId || req.user.id, limit ? parseInt(limit) : 50);
  }

  @Post(':id/messages')
  sendMessage(
    @Param('id') id: string,
    @Request() req: any,
    @Body('content') content: string,
  ) {
    return this.chatsService.sendMessage(id, req.user.userId || req.user.id, content);
  }

  @Post(':id/block')
  blockChat(@Param('id') id: string, @Request() req: any) {
    return this.chatsService.blockChat(id, req.user.userId || req.user.id);
  }

  @Post('block-user')
  blockUser(@Request() req: any, @Body('email') email: string) {
    return this.chatsService.blockUser(req.user.userId || req.user.id, email);
  }

  @Post(':id/mute')
  muteChat(@Param('id') id: string, @Request() req: any) {
    return this.chatsService.muteChat(id, req.user.userId || req.user.id);
  }

  @Get('users/all')
  getAllUsers(@Request() req: any, @Query('search') search?: string) {
    return this.chatsService.getAllUsers(req.user.userId || req.user.id, search);
  }
}

