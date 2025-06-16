import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwaggerPlugin } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupSwaggerPlugin(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => console.error(error));
