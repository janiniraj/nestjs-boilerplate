import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { EmmLogger } from './logger/logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust proxy for getting client's IP
  app.enable('trust proxy');

  // Register global providers
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 5000;
  EmmLogger.log(`Listening on port: ${port}`, 'Main');

  await app.listen(port);
}
bootstrap();
