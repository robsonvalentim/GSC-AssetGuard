import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetStatus } from './entities/asset.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateAssetDto } from './dto/create-asset.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  async createAsset(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  async findAll() {
    return this.assetsService.findAll();
  }

  @Get(':internalId')
  async findOne(@Param('internalId') internalId: string) {
    return this.assetsService.findOneByInternalId(internalId);
  }

  @Patch(':internalId/status')
  async updateStatus(
    @Param('internalId') internalId: string,
    @Body('status') status: AssetStatus,
  ) {
    return this.assetsService.updateStatus(internalId, status);
  }
}
