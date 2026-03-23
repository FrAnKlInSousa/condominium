import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req,
  ) {
    const user = req.user;

    // 🔐 regra de autorização
    if (user.role !== 'DIVINE') {
      throw new ForbiddenException(
        'Apenas usuários com permissão podem alterar status',
      );
    }

    return this.usersService.updateStatus(Number(id), status);
  }
}
