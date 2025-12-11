import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { Server } from '../entities/server.entity';
import { MinecraftApiService } from '../services/minecraft-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([Server])],
  controllers: [ServersController],
  providers: [ServersService, MinecraftApiService],
  exports: [ServersService],
})
export class ServersModule {}

