import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationStatus } from './notificationStatus.entity';
import { NotificationStatusService } from './notificationStatus.service';
import { NotificationStatusResolver } from './notificationStatus.resolver';
import { NotificationStatusController } from './notificationStatus.controller';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationStatus]), NotificationModule],
  controllers: [NotificationStatusController],
  providers: [NotificationStatusService, NotificationStatusResolver],
  exports: [NotificationStatusService]
})
export class NotificationStatusModule {}
