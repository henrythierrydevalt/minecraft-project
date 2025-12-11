import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from '../dto/server/create-server.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createServerDto: CreateServerDto, @Request() req) {
    return this.serversService.create(createServerDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.serversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serversService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string) {
    return this.serversService.updateStatus(id);
  }

  @Get(':id/details')
  getDetails(@Param('id') id: string) {
    return this.serversService.getServerDetails(id);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  vote(@Param('id') id: string, @Request() req) {
    return this.serversService.vote(id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.serversService.remove(id, req.user.userId);
  }
}

