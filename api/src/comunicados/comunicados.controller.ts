import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ComunicadosService } from './comunicados.service';
import { CreateInformativoDto } from './dto/create-informativo.dto';
import { UpdateInformativoDto } from './dto/update-informativo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comunicados')
export class ComunicadosController {
  constructor(private readonly service: ComunicadosService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('data') data?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 5,
  ) {
    return this.service.findAll(search, data, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateInformativoDto) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateInformativoDto) {
    return this.service.update(Number(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/delete')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
