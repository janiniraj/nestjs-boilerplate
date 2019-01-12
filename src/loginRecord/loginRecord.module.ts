import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginRecord } from './loginRecord.entity';
import { LoginRecordService } from './loginRecord.service';
import { LoginRecordResolver } from './loginRecord.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([LoginRecord])],
  controllers: [],
  providers: [LoginRecordService, LoginRecordResolver],
  exports: [LoginRecordService]
})
export class LoginRecordModule {}
