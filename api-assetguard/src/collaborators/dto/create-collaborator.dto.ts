import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateCollaboratorDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  nome!: string;

  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      return value.replace(/\D/g, '');
    }
    return value as unknown;
  })
  cpf!: string;

  @IsNotEmpty({ message: 'A matrícula é obrigatória.' })
  @IsString()
  matricula!: string;

  @IsNotEmpty({ message: 'O turno é obrigatório.' })
  @IsString()
  turno!: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
