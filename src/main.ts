import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins =
    process.env.CORS_ORIGINS?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  const resolvedCorsOrigins =
    corsOrigins.length > 0 ? corsOrigins : ["http://localhost:3001"];

  app.enableCors({
    origin: resolvedCorsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Travel CRM API')
    .setDescription('API documentation for Travel CRM backend')
    .setVersion('1.0')
    .addCookieAuth("access_token")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.use(cookieParser()); 

  await app.listen(3000);
}
bootstrap();
