import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginRecord } from './loginRecord.entity';
import { LoginRecordService } from './loginRecord.service';
import { LoginRecordResolver } from './loginRecord.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginRecord]),
    forwardRef(() => UserModule)
  ],
  controllers: [],
  providers: [LoginRecordService, LoginRecordResolver],
  exports: [LoginRecordService]
})
export class LoginRecordModule {}
