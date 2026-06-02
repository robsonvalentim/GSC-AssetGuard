import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { Movement } from './entities/movement.entity';
import { Asset } from '../assets/entities/asset.entity';
import { Collaborator } from '../collaborators/entities/collaborator.entity';

@Module({
  imports: [
    // Aqui nós "liberamos" os repositórios para serem usados pelo Service
    TypeOrmModule.forFeature([Movement, Asset, Collaborator])
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}