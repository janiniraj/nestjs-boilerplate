import * as dotenv from 'dotenv';
dotenv.config();

import { AppModule } from './app.module';
import { BackendLogger } from './logger/BackendLogger';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceptions/AllExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new BackendLogger('Main.ts');

  // Trust proxy for getting client's IP
  app.enable('trust proxy');

  // Register global providers
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Handle uncaught/unhandled exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err}`, err.stack);
  });
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled exception: ${err}`, err.stack);
  });

  const port = process.env.PORT || 5000;

  logger.log(`Listening on port: ${port}`);

  await app.listen(port);
}
bootstrap();
