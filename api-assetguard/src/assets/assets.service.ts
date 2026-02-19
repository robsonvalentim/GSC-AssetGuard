import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';

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
}