import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateInformativoDto } from './dto/create-informativo.dto';
import { UpdateInformativoDto } from './dto/update-informativo.dto';

@Injectable()
export class ComunicadosService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async findAll(search?: string, data?: string, page = 1, limit = 5) {
    const offset = (page - 1) * limit;

    let baseQuery = `SELECT * FROM informativos WHERE deleted_at IS NULL`;
    const values: any[] = [];

    if (search) {
      values.push(`%${search}%`);
      baseQuery += ` AND (titulo ILIKE $${values.length} OR descricao ILIKE $${values.length})`;
    }

    if (data) {
      values.push(data);
      baseQuery += ` AND data = $${values.length}`;
    }

    const totalRes = await this.pool.query(
      `SELECT COUNT(*) FROM (${baseQuery}) as total`,
      values,
    );

    values.push(limit, offset);

    const dataRes = await this.pool.query(
      baseQuery +
        ` ORDER BY data DESC, id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );

    return {
      data: dataRes.rows,
      total: Number(totalRes.rows[0].count),
    };
  }

  async create(body: CreateInformativoDto) {
    const { titulo, descricao, data } = body;

    const res = await this.pool.query(
      `INSERT INTO informativos (titulo, descricao, data)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [titulo, descricao, data],
    );

    return res.rows[0];
  }

  async update(id: number, body: UpdateInformativoDto) {
    const { titulo, descricao, data } = body;

    const res = await this.pool.query(
      `UPDATE informativos
   SET titulo = $1,
       descricao = $2,
       data = $3,
       updated_at = CURRENT_TIMESTAMP
   WHERE id = $4 AND deleted_at IS NULL
   RETURNING *`,
      [titulo, descricao, data, id],
    );

    return res.rows[0];
  }

  async delete(id: number) {
    await this.pool.query(
      `UPDATE informativos
   SET deleted_at = CURRENT_TIMESTAMP
   WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return { success: true };
  }

  async restore(id: number) {
    await this.pool.query(
      `UPDATE informativos SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL`,
      [id],
    );
  }
}
