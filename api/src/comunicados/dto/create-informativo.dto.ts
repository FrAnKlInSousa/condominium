import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateInformativoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsDateString()
  data: string;
}
