import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ComunicadosService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async findAll(search?: string, data?: string, page = 1, limit = 5) {
    const offset = (page - 1) * limit;

    let baseQuery = `SELECT * FROM informativos WHERE 1=1`;
    const values: any[] = [];

    if (search) {
      values.push(`%${search}%`);
      baseQuery += ` AND (titulo ILIKE $${values.length} OR descricao ILIKE $${values.length})`;
    }

    if (data) {
      values.push(data);
      baseQuery += ` AND data = $${values.length}`;
    }

    const totalRes = await this.pool.query(baseQuery, values);

    values.push(limit, offset);

    const dataRes = await this.pool.query(
      baseQuery +
        ` ORDER BY created_at DESC, id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );

    return {
      data: dataRes.rows,
      total: totalRes.rows.length,
    };
  }

  async create(body: any) {
    const { titulo, descricao, data } = body;

    const res = await this.pool.query(
      `INSERT INTO informativos (titulo, descricao, data)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [titulo, descricao, data],
    );

    return res.rows[0];
  }

  async update(id: number, body: any) {
    const { titulo, descricao, data } = body;

    const res = await this.pool.query(
      `UPDATE informativos
       SET titulo = $1, descricao = $2, data = $3
       WHERE id = $4
       RETURNING *`,
      [titulo, descricao, data, id],
    );

    return res.rows[0];
  }

  async delete(id: number) {
    await this.pool.query(`DELETE FROM informativos WHERE id = $1`, [id]);
    return { success: true };
  }
}
