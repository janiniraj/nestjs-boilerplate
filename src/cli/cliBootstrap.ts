import * as dotenv from 'dotenv';
dotenv.config();
import * as owasp from 'owasp-password-strength-test';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { BackendLogger } from 'src/logger/BackendLogger';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new BackendLogger('Main.ts');

  // Trust proxy for getting client's IP
  app.enable('trust proxy');

  // Configure any globally configured modules
  owasp.config({
    allowPassphrases: true,
    maxLength: 128,
    minLength: 10,
    minPhraseLength: 20,
    minOptionalTestsToPass: 3
  });

  // Handle uncaught/unhandled exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err}`, err.stack);
  });
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled exception: ${err}`, err.stack);
  });

  return app;
}
