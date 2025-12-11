import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { UpdatePostDto } from '../dto/post/update-post.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.postsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      category,
    );
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.postsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req?: any) {
    const userId = req?.user?.id || req?.user?.userId || undefined;
    return this.postsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req) {
    return this.postsService.update(id, updatePostDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(id, req.user.userId);
  }
}

