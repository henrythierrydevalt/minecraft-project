import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from '../entities/server.entity';
import { CreateServerDto } from '../dto/server/create-server.dto';
import { MinecraftApiService } from '../services/minecraft-api.service';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private serversRepository: Repository<Server>,
    private minecraftApiService: MinecraftApiService,
  ) {}

  async create(createServerDto: CreateServerDto, userId: string): Promise<any> {
    try {
      let status = {
        online: false,
        players: { online: 0, max: 0 },
        version: null,
        icon: null,
      };

      try {
        status = await this.minecraftApiService.getServerStatus(
      createServerDto.address,
      createServerDto.port,
    );
      } catch (error) {
        console.error(`Failed to get server status for ${createServerDto.address}:`, error.message);
      }

    const server = this.serversRepository.create({
      ...createServerDto,
      ownerId: userId,
        isOnline: status?.online || false,
        onlinePlayers: status?.players?.online || 0,
        maxPlayers: status?.players?.max || 0,
        version: status?.version || createServerDto.version || 'Unknown',
      port: createServerDto.port || 25565,
      bannerUrl: createServerDto.bannerUrl || 'https://staticg.sportskeeda.com/editor/2025/01/8827f-17376979472538-1920.jpg',
    });

      const savedServer = await this.serversRepository.save(server);
      
      // Buscar com relação do owner para retornar completo
      const serverWithOwner = await this.serversRepository.findOne({
        where: { id: savedServer.id },
        relations: ['owner'],
      });

      if (!serverWithOwner) {
        throw new NotFoundException('Server not found after creation');
  }

      return {
        id: serverWithOwner.id,
        name: serverWithOwner.name,
        address: serverWithOwner.address,
        port: serverWithOwner.port || 25565,
        description: serverWithOwner.description || '',
        bannerUrl: serverWithOwner.bannerUrl || 'https://staticg.sportskeeda.com/editor/2025/01/8827f-17376979472538-1920.jpg',
        version: serverWithOwner.version || 'Unknown',
        onlinePlayers: serverWithOwner.onlinePlayers || 0,
        maxPlayers: serverWithOwner.maxPlayers || 0,
        isOnline: serverWithOwner.isOnline || false,
        gamemode: serverWithOwner.gamemode || 'survival',
        votes: serverWithOwner.votes || 0,
        owner: serverWithOwner.owner ? {
          id: serverWithOwner.owner.id,
          username: serverWithOwner.owner.username,
          email: serverWithOwner.owner.email,
          role: serverWithOwner.owner.role,
          level: serverWithOwner.owner.level,
          experience: serverWithOwner.owner.experience,
        } : null,
        ownerId: serverWithOwner.ownerId,
        createdAt: serverWithOwner.createdAt,
        updatedAt: serverWithOwner.updatedAt,
      };
    } catch (error) {
      console.error('Erro ao criar servidor:', error);
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    const servers = await this.serversRepository.find({
      relations: ['owner'],
      order: { votes: 'DESC', createdAt: 'DESC' },
    });

    // Formatar resposta com todos os dados necessários
    return servers.map((server) => ({
      id: server.id,
      name: server.name,
      address: server.address,
      port: server.port || 25565,
      description: server.description || '',
      bannerUrl: server.bannerUrl || 'https://staticg.sportskeeda.com/editor/2025/01/8827f-17376979472538-1920.jpg',
      version: server.version || 'Unknown',
      onlinePlayers: server.onlinePlayers || 0,
      maxPlayers: server.maxPlayers || 0,
      isOnline: server.isOnline || false,
      gamemode: server.gamemode || 'survival',
      votes: server.votes || 0,
      owner: server.owner ? {
        id: server.owner.id,
        username: server.owner.username,
        email: server.owner.email,
        role: server.owner.role,
        level: server.owner.level,
        experience: server.owner.experience,
      } : null,
      ownerId: server.ownerId,
      createdAt: server.createdAt,
      updatedAt: server.updatedAt,
    }));
  }

  async findOne(id: string): Promise<any> {
    const server = await this.serversRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!server) {
      throw new NotFoundException('Server not found');
    }

    // Formatar resposta com todos os dados necessários
    return {
      id: server.id,
      name: server.name,
      address: server.address,
      port: server.port || 25565,
      description: server.description || '',
      bannerUrl: server.bannerUrl || 'https://staticg.sportskeeda.com/editor/2025/01/8827f-17376979472538-1920.jpg',
      version: server.version || 'Unknown',
      onlinePlayers: server.onlinePlayers || 0,
      maxPlayers: server.maxPlayers || 0,
      isOnline: server.isOnline || false,
      gamemode: server.gamemode || 'survival',
      votes: server.votes || 0,
      owner: server.owner ? {
        id: server.owner.id,
        username: server.owner.username,
        email: server.owner.email,
        role: server.owner.role,
        level: server.owner.level,
        experience: server.owner.experience,
      } : null,
      ownerId: server.ownerId,
      createdAt: server.createdAt,
      updatedAt: server.updatedAt,
    };
  }

  async updateStatus(id: string): Promise<any> {
    const serverData = await this.findOne(id);
    const server = await this.serversRepository.findOne({ where: { id } });
    
    if (!server) {
      throw new NotFoundException('Server not found');
    }

    const status = await this.minecraftApiService.getServerStatus(
      server.address,
      server.port,
    );

    server.isOnline = status.online;
    server.onlinePlayers = status.players.online;
    server.maxPlayers = status.players.max;
    server.version = status.version || server.version;

    if (status.icon && !server.bannerUrl) {
      server.bannerUrl = `data:image/png;base64,${status.icon}`;
    }

    const updatedServer = await this.serversRepository.save(server);
    
    // Retornar formato padronizado
    return {
      id: updatedServer.id,
      name: updatedServer.name,
      address: updatedServer.address,
      port: updatedServer.port || 25565,
      description: updatedServer.description || '',
      bannerUrl: updatedServer.bannerUrl || 'https://staticg.sportskeeda.com/editor/2025/01/8827f-17376979472538-1920.jpg',
      version: updatedServer.version || 'Unknown',
      onlinePlayers: updatedServer.onlinePlayers || 0,
      maxPlayers: updatedServer.maxPlayers || 0,
      isOnline: updatedServer.isOnline || false,
      gamemode: updatedServer.gamemode || 'survival',
      votes: updatedServer.votes || 0,
      ownerId: updatedServer.ownerId,
      createdAt: updatedServer.createdAt,
      updatedAt: updatedServer.updatedAt,
    };
  }

  async getServerDetails(id: string): Promise<any> {
    const server = await this.findOne(id);
    const status = await this.minecraftApiService.getServerStatus(
      server.address,
      server.port,
    );

    return {
      ...server,
      status: {
        online: status.online,
        players: status.players,
        version: status.version,
        motd: status.motd,
        icon: status.icon,
        software: status.software,
        plugins: status.plugins,
        mods: status.mods,
        hostname: status.hostname,
        ip: status.ip,
      },
    };
  }

  async vote(id: string, userId: string): Promise<any> {
    const server = await this.serversRepository.findOne({ where: { id } });
    
    if (!server) {
      throw new NotFoundException('Server not found');
    }

    server.votes += 1;
    await this.serversRepository.save(server);
    
    // Buscar com relação do owner para retornar completo
    const serverWithOwner = await this.serversRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!serverWithOwner) {
      throw new NotFoundException('Server not found after vote');
    }

    return {
      id: serverWithOwner.id,
      name: serverWithOwner.name,
      address: serverWithOwner.address,
      port: serverWithOwner.port || 25565,
      description: serverWithOwner.description || '',
      bannerUrl: serverWithOwner.bannerUrl || 'https://staticg.sportskeeda.com/editor/2025/01/8827f-17376979472538-1920.jpg',
      version: serverWithOwner.version || 'Unknown',
      onlinePlayers: serverWithOwner.onlinePlayers || 0,
      maxPlayers: serverWithOwner.maxPlayers || 0,
      isOnline: serverWithOwner.isOnline || false,
      gamemode: serverWithOwner.gamemode || 'survival',
      votes: serverWithOwner.votes || 0,
      owner: serverWithOwner.owner ? {
        id: serverWithOwner.owner.id,
        username: serverWithOwner.owner.username,
        email: serverWithOwner.owner.email,
        role: serverWithOwner.owner.role,
        level: serverWithOwner.owner.level,
        experience: serverWithOwner.owner.experience,
      } : null,
      ownerId: serverWithOwner.ownerId,
      createdAt: serverWithOwner.createdAt,
      updatedAt: serverWithOwner.updatedAt,
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    const server = await this.serversRepository.findOne({ where: { id } });
    
    if (!server) {
      throw new NotFoundException('Server not found');
    }

    if (server.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own servers');
    }
    
    await this.serversRepository.remove(server);
  }
}

