import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { EmmLogger } from './logger/EmmLogger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new EmmLogger('Main.ts');

  // Trust proxy for getting client's IP
  app.enable('trust proxy');

  // Register global providers
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 5000;
  logger.log(`Listening on port: ${port}`);

  await app.listen(port);
}
bootstrap();
