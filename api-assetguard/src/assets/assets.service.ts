import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetStatus } from './entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto'; // Adicionaremos este DTO em breve

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    // 1. Trava de segurança apenas para o Serial (o internalId será gerado por nós)
    const existingAsset = await this.assetsRepository.findOne({
      where: { serialNumber: createAssetDto.serialNumber },
    });

    if (existingAsset) {
      throw new ConflictException(
        'Ja existe um equipamento com este numero de serie.',
      );
    }

    // 2. Busca o último patrimônio cadastrado para gerar a sequência
    const lastAsset = await this.assetsRepository.find({
      order: { internalId: 'DESC' },
      take: 1,
    });

    let nextIdNumber = 1;
    if (lastAsset.length > 0 && lastAsset[0].internalId) {
      nextIdNumber = parseInt(lastAsset[0].internalId, 10) + 1;
    }

    // 3. Formata para sempre ter 3 dígitos (001, 050, 999)
    const internalId = nextIdNumber.toString().padStart(3, '0');

    // 4. Cria o registro forçando o status inicial
    const newAsset = this.assetsRepository.create({
      ...createAssetDto,
      internalId,
      status: AssetStatus.AVAILABLE,
    });

    return this.assetsRepository.save(newAsset);
  }

  async findAll(): Promise<Asset[]> {
    return this.assetsRepository.find({
      order: { internalId: 'ASC' }, // Adicionei ordenação para facilitar a vida da TI no Front-end
    });
  }

  async findOneByInternalId(internalId: string): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({
      where: { internalId },
    });
    if (!asset) {
      throw new NotFoundException(
        `Equipamento com etiqueta ${internalId} nao encontrado.`,
      );
    }
    return asset;
  }

  async updateStatus(internalId: string, status: AssetStatus): Promise<Asset> {
    const asset = await this.findOneByInternalId(internalId);
    asset.status = status;
    return this.assetsRepository.save(asset);
  }
}
