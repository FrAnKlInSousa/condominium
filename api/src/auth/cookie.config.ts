import { CookieOptions } from 'express';

export function getCookieConfig(): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 48, // 2 dias
  };
}

export function clearCookieConfig(): CookieOptions {
  return {
    ...getCookieConfig(),
    maxAge: 0,
  };
}
