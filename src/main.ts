import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AgroCultura')
    .setDescription('API para Produtores e Culturas de todo o Brasil')
    .setVersion('1.0')
    .addTag('agro')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => console.error(error));
