import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async findOrCreate(tagName: string): Promise<Tag> {
    const normalizedName = tagName.toLowerCase().trim();
    let tag = await this.tagsRepository.findOne({
      where: { name: normalizedName },
    });

    if (!tag) {
      tag = this.tagsRepository.create({
        name: normalizedName,
        usageCount: 0,
      });
      tag = await this.tagsRepository.save(tag);
    }

    return tag;
  }

  async findOrCreateMany(tagNames: string[]): Promise<Tag[]> {
    const tags = await Promise.all(
      tagNames.map((name) => this.findOrCreate(name)),
    );

    for (const tag of tags) {
      tag.usageCount += 1;
      await this.tagsRepository.save(tag);
    }

    return tags;
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagsRepository.find({
      order: { usageCount: 'DESC', createdAt: 'DESC' },
      take: 50,
    });
  }

  async findByPost(postId: string): Promise<Tag[]> {
    return await this.tagsRepository
      .createQueryBuilder('tag')
      .innerJoin('tag.posts', 'post', 'post.id = :postId', { postId })
      .getMany();
  }

  async search(query: string): Promise<Tag[]> {
    return await this.tagsRepository
      .createQueryBuilder('tag')
      .where('tag.name LIKE :query', { query: `%${query.toLowerCase()}%` })
      .orderBy('tag.usageCount', 'DESC')
      .take(10)
      .getMany();
  }
}

