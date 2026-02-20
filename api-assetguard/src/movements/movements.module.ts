import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { Movement } from './entities/movement.entity';
import { AssetsModule } from '../assets/assets.module';
import { CollaboratorsModule } from '../collaborators/collaborators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]),
    AssetsModule,
    CollaboratorsModule
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}