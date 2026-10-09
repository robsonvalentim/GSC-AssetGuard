import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Movement, ReturnCondition } from './entities/movement.entity';
import { Asset, AssetStatus } from '../assets/entities/asset.entity';
import { Collaborator } from '../collaborators/entities/collaborator.entity';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Collaborator)
    private readonly collaboratorRepository: Repository<Collaborator>,
    private readonly dataSource: DataSource,
  ) {}

  async checkout(createCheckoutDto: CreateCheckoutDto): Promise<Movement> {
    const { collaboratorId, assetId } = createCheckoutDto;

    // 1. Validar se o Ativo (Coletor) existe e está disponível
    const asset = await this.assetRepository.findOne({
      where: { id: assetId },
    });
    if (!asset) {
      throw new NotFoundException('Equipamento não encontrado.');
    }

    if (asset.status !== AssetStatus.AVAILABLE) {
      throw new BadRequestException(
        'Este equipamento não está disponível para retirada.',
      );
    }

    // 2. Validar se o Colaborador existe e está ativo
    const collaborator = await this.collaboratorRepository.findOne({
      where: { id: collaboratorId, ativo: true },
    });
    if (!collaborator) {
      throw new NotFoundException(
        'Colaborador não encontrado ou está inativo.',
      );
    }

    // 3. Trava Anti-Acúmulo: Verificar se o colaborador já possui um ativo em aberto
    const openMovement = await this.movementRepository.findOne({
      where: { collaboratorId, checkInAt: IsNull() },
    });
    if (openMovement) {
      throw new BadRequestException(
        'O colaborador já possui um equipamento pendente de devolução.',
      );
    }

    // 4. Executar transação: Criar movimento e atualizar status do ativo
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newMovement = this.movementRepository.create({
        collaboratorId,
        assetId,
      });

      const savedMovement = await queryRunner.manager.save(newMovement);

      // Atualizar status do ativo para "EM USO"
      asset.status = AssetStatus.IN_USE;
      await queryRunner.manager.save(asset);

      await queryRunner.commitTransaction();
      return savedMovement;
    } catch (err) {
      console.error('Erro no DB:', err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        'Erro ao processar a retirada do equipamento.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async checkin(updateCheckinDto: UpdateCheckinDto): Promise<Movement> {
    const { assetId, returnCondition, observation } = updateCheckinDto;

    // 1. Buscar a movimentação em aberto (sem data de devolução) para este ativo exato
    const openMovement = await this.movementRepository.findOne({
      where: { assetId, checkInAt: IsNull() },
    });

    if (!openMovement) {
      throw new NotFoundException(
        'Nenhuma retirada ativa encontrada para este equipamento.',
      );
    }

    // 2. Transação para garantir integridade atômica
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 3. Atualizar a movimentação com a data de agora e as condições de retorno
      openMovement.checkInAt = new Date();
      openMovement.returnCondition = returnCondition;
      if (observation) {
        openMovement.observation = observation;
      }

      await queryRunner.manager.save(openMovement);

      // 4. Buscar o ativo para alterar seu status dinamicamente
      const asset = await queryRunner.manager.findOne(Asset, {
        where: { id: assetId },
      });

      if (asset) {
        // Se estiver OK, volta para a prateleira. Se tiver defeito, vai para a TI.
        if (returnCondition === ReturnCondition.OK) {
          asset.status = AssetStatus.AVAILABLE;
        } else {
          asset.status = AssetStatus.MAINTENANCE;
        }
        await queryRunner.manager.save(asset);
      }

      await queryRunner.commitTransaction();
      return openMovement;
    } catch (err) {
      console.error('Erro no DB:', err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        'Erro ao processar a devolução do equipamento.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async resetDevDb() {
    // 1. Atualiza TODOS os coletores para AVAILABLE forçando via QueryBuilder
    await this.assetRepository
      .createQueryBuilder()
      .update()
      .set({ status: AssetStatus.AVAILABLE })
      .execute();

    // 2. Apaga TODAS as movimentações de teste (A função .clear() trunca a tabela, limpando tudo)
    await this.movementRepository.clear();

    return {
      message:
        'Banco resetado com sucesso! Coletor DISPONÍVEL e histórico de movimentações apagado.',
    };
  }
}
