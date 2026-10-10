import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty({ message: 'O numero de serie (serialNumber) e obrigatorio.' })
  @IsString()
  serialNumber!: string;

  @IsNotEmpty({ message: 'O modelo do equipamento e obrigatorio.' })
  @IsString()
  model!: string;
}
