import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Asset, AssetStatus } from './entities/asset.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAsset(@Body() assetData: Partial<Asset>) {
    return this.assetsService.create(assetData);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return this.assetsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':internalId')
  async findOne(@Param('internalId') internalId: string) {
    return this.assetsService.findOneByInternalId(internalId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':internalId/status')
  async updateStatus(
    @Param('internalId') internalId: string,
    @Body('status') status: AssetStatus,
  ) {
    return this.assetsService.updateStatus(internalId, status);
  }
}