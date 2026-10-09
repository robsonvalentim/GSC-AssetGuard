import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReturnCondition } from '../entities/movement.entity';

export class UpdateCheckinDto {
  @IsNotEmpty({
    message: 'O ID do ativo (coletor) é obrigatório para a devolução.',
  })
  @IsUUID('4', { message: 'O ID do ativo deve ser um UUID válido.' })
  assetId!: string;

  @IsNotEmpty({
    message: 'A condição de retorno do equipamento é obrigatória.',
  })
  @IsEnum(ReturnCondition, { message: 'Condição de retorno inválida.' })
  returnCondition!: ReturnCondition;

  @IsOptional()
  @IsString({ message: 'A observação deve ser um texto.' })
  observation?: string;
}
