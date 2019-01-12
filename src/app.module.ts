import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DateScalar } from './common/scalars/date.scalar';
import { RoleModule } from './role/role.module';


@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: process.env.NODE_ENV === 'development',
      resolvers: { Date: DateScalar },
      context: ({ req }) => ({ req })
    }),
    TypeOrmModule.forRoot(),
    ConfigModule,
    UserModule,
    AuthModule,
    RoleModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
