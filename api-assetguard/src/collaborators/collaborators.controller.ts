import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { Collaborator } from './entities/collaborator.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dadosColaborador: Partial<Collaborator>) {
    return this.collaboratorsService.create(dadosColaborador);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return this.collaboratorsService.findAll();
  }
}