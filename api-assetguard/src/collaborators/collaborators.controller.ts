import 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CollaboratorsService } from './collaborators.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importCsv(@UploadedFile() file: Express.Multer.File) {
    return this.collaboratorsService.importCsv(file);
  }

  @Post()
  create(@Body() createCollaboratorDto: CreateCollaboratorDto) {
    return this.collaboratorsService.create(createCollaboratorDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.collaboratorsService.findAll(search);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.collaboratorsService.deactivate(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.collaboratorsService.activate(id);
  }
}
