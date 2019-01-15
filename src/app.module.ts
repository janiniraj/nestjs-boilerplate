import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserConfigModule } from './userConfig/userConfig.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DateScalar } from './common/scalars/date.scalar';
import { RoleModule } from './role/role.module';
import { SessionMiddleware } from './common/middleware/session.middleware';
import { PasswordResetModule } from './passwordReset/passwordReset.module';
import { NotificationStatusModule } from './notificationStatus/notificationStatus.module';
import { EndpointScanModule } from './endpointScan/endpointScan.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: process.env.NODE_ENV === 'development',
      resolvers: { Date: DateScalar },
      context: ({ req }) => ({ req })
    }),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    RoleModule,
    UserConfigModule,
    PasswordResetModule,
    NotificationStatusModule,
    EndpointScanModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
