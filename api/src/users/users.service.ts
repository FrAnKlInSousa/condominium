import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

export interface User {
  id: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    const res = await this.pool.query(
      `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [email],
    );

    return res.rows[0] || null;
  }

  async create(email: string, password: string): Promise<User> {
    const res = await this.pool.query(
      `INSERT INTO users (email, password)
       VALUES ($1, $2)
       RETURNING *`,
      [email, password],
    );

    return res.rows[0];
  }
}
