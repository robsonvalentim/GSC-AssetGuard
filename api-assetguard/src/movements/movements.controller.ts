import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('movements')
@UseGuards(AuthGuard('jwt')) // Catraca de segurança ativada para todas as rotas deste controlador
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post('checkout')
  checkout(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.movementsService.checkout(createCheckoutDto);
  }

  // Rota GET para resetar o banco (Apenas para Testes)
  @Get('reset')
  resetDevDb() {
    return this.movementsService.resetDevDb();
  }
}