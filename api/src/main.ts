import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos extras
      forbidNonWhitelisted: true, // erro se mandar campo inválido
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      // permite requisições sem origin (ex: curl, mobile)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:3000',
        'https://www.condominiumsp.com.br',
      ];

      // permite domínios fixos
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // permite qualquer preview da Vercel
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
