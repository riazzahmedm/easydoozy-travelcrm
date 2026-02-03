import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ ENABLE CORS
  app.enableCors({
    origin: true,          // allow all origins 
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Travel CRM API')
    .setDescription('API documentation for Travel CRM backend')
    .setVersion('1.0')
    .addBearerAuth() // JWT ready
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
