
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationStatus } from './notificationStatus.entity';
import { NotificationStatusService } from './notificationStatus.service';
import { NotificationStatusResolver } from './notificationStatus.resolver';
import { NotificationStatusController } from './notificationStatus.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationStatus])],
  controllers: [NotificationStatusController],
  providers: [NotificationStatusService, NotificationStatusResolver],
  exports: [NotificationStatusService]
})
export class NotificationStatusModule {}