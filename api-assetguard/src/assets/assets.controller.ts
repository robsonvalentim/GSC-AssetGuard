import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Asset } from './entities/asset.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAsset(@Body() assetData: Partial<Asset>) {
    return this.assetsService.create(assetData);
  }
}