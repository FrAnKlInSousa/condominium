import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateInformativoDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDateString()
  @IsOptional()
  data?: string;
}
