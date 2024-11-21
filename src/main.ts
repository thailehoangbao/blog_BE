import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Blog API')
  .setDescription("List APIs for simple Blog")
  .setVersion('1.0')
  .addTag("Auth")
  .addTag("User")
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document)
  app.enableCors();
  app.use(express.static("."))
  await app.listen(3000);
}
bootstrap();
