import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';
import { QuietLogger } from './logger/QuietLogger';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.useLogger(app.get(QuietLogger));
  app
    .select(CommandModule)
    .get(CommandService)
    .exec();
})();
