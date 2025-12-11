import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { UpdatePostDto } from '../dto/post/update-post.dto';
import { TagsService } from '../tags/tags.service';
import { PostView } from '../entities/post-view.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(PostView)
    private postViewsRepository: Repository<PostView>,
    private tagsService: TagsService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const { tags, ...postData } = createPostDto;
    const post = this.postsRepository.create({
      ...postData,
      authorId: userId,
      category: postData.category || 'general',
    });

    const savedPost = await this.postsRepository.save(post);

    if (tags && tags.length > 0) {
      const tagEntities = await this.tagsService.findOrCreateMany(tags);
      savedPost.tags = tagEntities;
      await this.postsRepository.save(savedPost);
    }

    return await this.postsRepository.findOne({
      where: { id: savedPost.id },
      relations: ['author', 'tags'],
    }) || savedPost;
  }

  async findAll(page: number = 1, limit: number = 10, category?: string): Promise<{ posts: Post[]; total: number }> {
    const query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.tags', 'tags')
      .orderBy('post.createdAt', 'DESC');

    if (category) {
      query.where('post.category = :category', { category });
    }

    const [posts, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { posts, total };
  }

  async findOne(id: string, userId?: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'likes.user', 'comments', 'comments.author', 'tags'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (userId) {
      const existingView = await this.postViewsRepository.findOne({
        where: { postId: id, userId },
      });

      if (!existingView) {
        await this.postViewsRepository.save({
          postId: id,
          userId,
        });
        post.views += 1;
        await this.postsRepository.save(post);
      }
    }

    const viewCount = await this.postViewsRepository.count({
      where: { postId: id },
    });
    post.views = viewCount;

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
    const post = await this.findOne(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }
    Object.assign(post, updatePostDto);
    return await this.postsRepository.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.postsRepository.remove(post);
  }

  async findByUser(userId: string): Promise<Post[]> {
    try {
      const posts = await this.postsRepository.find({
        where: { authorId: userId },
        relations: ['author', 'likes', 'likes.user', 'comments', 'comments.author', 'tags'],
        order: { createdAt: 'DESC' },
      });
      
      // Adicionar contagem de views para cada post
      for (const post of posts) {
        const viewCount = await this.postViewsRepository.count({
          where: { postId: post.id },
        });
        post.views = viewCount;
      }
      
      return posts;
    } catch (error) {
      console.error('Error in findByUser:', error);
      throw error;
    }
  }
}

