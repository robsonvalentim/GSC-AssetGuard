import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCheckoutDto {
  @IsNotEmpty({ message: 'O ID do colaborador é obrigatório.' })
  @IsUUID('4', { message: 'O ID do colaborador deve ser um UUID válido.' })
  collaboratorId!: string;

  @IsNotEmpty({ message: 'O ID do ativo é obrigatório.' })
  @IsUUID('4', { message: 'O ID do ativo deve ser um UUID válido.' })
  assetId!: string;
}