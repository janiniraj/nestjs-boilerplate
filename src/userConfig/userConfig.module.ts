import { Module } from '@nestjs/common';
import { UserConfigService } from './userConfig.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConfig } from './userConfig.entity';
import { UserConfigResolver } from './userConfig.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserConfig])],
  providers: [UserConfigService, UserConfigResolver],
  exports: [UserConfigService]
})
export class UserConfigModule {}
