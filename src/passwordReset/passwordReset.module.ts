import { Module } from '@nestjs/common';
import { PasswordResetService } from './passwordReset.service';
import { UserModule } from 'src/user/user.module';
import { PasswordResetController } from './passwordReset.controller';
import { EmailerModule } from 'src/emailer/emailer.module';

@Module({
  imports: [UserModule, EmailerModule],
  controllers: [PasswordResetController],
  providers: [PasswordResetService],
  exports: [PasswordResetService]
})
export class PasswordResetModule {}
