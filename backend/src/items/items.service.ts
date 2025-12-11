import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dto/item/create-item.dto';
import { UpdateItemDto } from '../dto/item/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto, userId: string): Promise<Item> {
    const item = this.itemsRepository.create({
      ...createItemDto,
      userId,
    });
    return await this.itemsRepository.save(item);
  }

  async findAll(userId: string): Promise<Item[]> {
    return await this.itemsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Item> {
    const item = await this.itemsRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (item.userId !== userId) {
      throw new ForbiddenException('You do not have access to this item');
    }
    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto, userId: string): Promise<Item> {
    const item = await this.findOne(id, userId);
    Object.assign(item, updateItemDto);
    return await this.itemsRepository.save(item);
  }

  async remove(id: string, userId: string): Promise<void> {
    const item = await this.findOne(id, userId);
    await this.itemsRepository.remove(item);
  }
}

