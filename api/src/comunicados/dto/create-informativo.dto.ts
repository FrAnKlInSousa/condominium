import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateInformativoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao: string;

  @IsDateString()
  data: string;
}
