import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Movement } from './entities/movement.entity';
import { Asset, AssetStatus } from '../assets/entities/asset.entity';
import { Collaborator } from '../collaborators/entities/collaborator.entity';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

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
    const asset = await this.assetRepository.findOne({ where: { id: assetId } });
    if (!asset) {
      throw new NotFoundException('Equipamento não encontrado.');
    }
    
    if (asset.status !== AssetStatus.AVAILABLE) {
      throw new BadRequestException('Este equipamento não está disponível para retirada.');
    }

    // 2. Validar se o Colaborador existe e está ativo
    const collaborator = await this.collaboratorRepository.findOne({ where: { id: collaboratorId, ativo: true } });
    if (!collaborator) {
      throw new NotFoundException('Colaborador não encontrado ou está inativo.');
    }

    // 3. Trava Anti-Acúmulo: Verificar se o colaborador já possui um ativo em aberto
    const openMovement = await this.movementRepository.findOne({
      where: { collaboratorId, checkInAt: IsNull() },
    });
    if (openMovement) {
      throw new BadRequestException('O colaborador já possui um equipamento pendente de devolução.');
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
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Erro ao processar a retirada do equipamento.');
    } finally {
      await queryRunner.release();
    }
  }
// Rota temporária apenas para ambiente de Desenvolvimento
// Rota temporária apenas para ambiente de Desenvolvimento
  async resetDevDb() {
    // 1. Atualiza TODOS os coletores para AVAILABLE forçando via QueryBuilder
    await this.assetRepository.createQueryBuilder()
      .update()
      .set({ status: AssetStatus.AVAILABLE })
      .execute();
    
    // 2. Apaga TODAS as movimentações de teste (A função .clear() trunca a tabela, limpando tudo)
    await this.movementRepository.clear();
    
    return { message: 'Banco resetado com sucesso! Coletor DISPONÍVEL e histórico de movimentações apagado.' };
  }
}