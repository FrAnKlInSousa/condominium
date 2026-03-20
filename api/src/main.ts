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
    origin: ['http://localhost:3000', 'https://condominium-6jtn.onrender.com'],
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
