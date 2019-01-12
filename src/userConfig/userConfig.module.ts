import { Module } from '@nestjs/common';
import { UserConfigService } from './userConfig.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConfig } from './userConfig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserConfig])],
  providers: [UserConfigService],
  exports: [UserConfigService]
})
export class UserConfigModule {}
