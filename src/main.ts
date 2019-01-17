import * as dotenv from 'dotenv';
dotenv.config();
import * as owasp from 'owasp-password-strength-test';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

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

  // Rate limit API requests
  app.use(
    new rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000
    })
  );

  // Configure any globally configured modules
  owasp.config({
    allowPassphrases: true,
    maxLength: 128,
    minLength: 10,
    minPhraseLength: 20,
    minOptionalTestsToPass: 3
  });

  // Register global providers
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new AllExceptionsFilter());

  // Enable security middleware
  app.use(helmet());
  app.enableCors();

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
