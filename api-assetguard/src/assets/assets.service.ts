import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetStatus } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  async create(assetData: Partial<Asset>): Promise<Asset> {
    const existingAsset = await this.assetsRepository.findOne({
      where: [
        { serialNumber: assetData.serialNumber },
        { internalId: assetData.internalId }
      ]
    });

    if (existingAsset) {
      throw new ConflictException('Ja existe um equipamento com este numero de serie ou patrimonio (internalId).');
    }

    const newAsset = this.assetsRepository.create(assetData);
    return this.assetsRepository.save(newAsset);
  }
  async findAll(): Promise<Asset[]> {
    return this.assetsRepository.find();
  }

  async findOneByInternalId(internalId: string): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({ where: { internalId } });
    if (!asset) {
      throw new NotFoundException(`Equipamento com etiqueta ${internalId} nao encontrado.`);
    }
    return asset;
  }

  async updateStatus(internalId: string, status: AssetStatus): Promise<Asset> {
    const asset = await this.findOneByInternalId(internalId);
    asset.status = status;
    return this.assetsRepository.save(asset);
  }
}