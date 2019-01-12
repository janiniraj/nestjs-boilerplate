import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserResolver } from './user.resolver';
import { RoleModule } from 'src/role/role.module';
import { UserConfigModule } from 'src/userConfig/userConfig.module';
import { LoginRecordModule } from 'src/loginRecord/loginRecord.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    RoleModule,
    UserConfigModule,
    LoginRecordModule
  ],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
