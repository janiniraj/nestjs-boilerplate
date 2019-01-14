import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { EmailerResolver } from './emailer.resolver';
import { EmailerController } from './emailer.controller';

@Module({
  imports: [],
  controllers: [EmailerController],
  providers: [EmailerService, EmailerResolver],
  exports: [EmailerService]
})
export class EmailerModule {}
