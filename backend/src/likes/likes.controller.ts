import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('post/:postId')
  @UseGuards(JwtAuthGuard)
  toggle(@Param('postId') postId: string, @Request() req) {
    return this.likesService.toggle(postId, req.user.userId);
  }

  @Get('post/:postId/count')
  async count(@Param('postId') postId: string) {
    const count = await this.likesService.count(postId);
    return { count };
  }

  @Get('post/:postId/status')
  @UseGuards(JwtAuthGuard)
  isLiked(@Param('postId') postId: string, @Request() req) {
    return this.likesService.isLiked(postId, req.user.userId);
  }
}

