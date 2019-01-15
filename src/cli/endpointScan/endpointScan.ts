import { NestApplicationContext, NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { INestApplicationContext } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AppService } from 'src/app.service';

(async () => {
  const ctx = await NestFactory.createApplicationContext(AppModule);

  const module = ctx.select<AppModule>(AppModule);
  const service = module.get<AppService>(AppService);
  service.getEndpointInfo();

  process.exit(0);
})();
