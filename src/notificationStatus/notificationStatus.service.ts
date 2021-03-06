import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BackendLogger } from 'src/logger/BackendLogger';
import { NotificationStatus } from './notificationStatus.entity';
import { Notification } from 'src/notification/notification.entity';
import { CreateNotificationDto } from './dtos/createNotification.dto';

@Injectable()
export class NotificationStatusService {
  private readonly logger = new BackendLogger(NotificationStatusService.name);

  constructor(
    @InjectRepository(NotificationStatus)
    private readonly notificationStatusRepository: Repository<
      NotificationStatus
    >
  ) {}

  async createNotification({
    userIds,
    title,
    notificationHtml
  }: CreateNotificationDto) {
    const newNotifications = [];
    this.logger.log(`Creating notification for users: ${userIds.join(', ')}`);

    for (const userId of userIds) {
      const notification = new Notification();
      notification.bodyHtml = notificationHtml;
      notification.title = title;

      newNotifications.push(
        this.notificationStatusRepository.create({
          userId,
          notification
        })
      );
    }

    await this.notificationStatusRepository.save(newNotifications);

    return 'Success';
  }

  async findAll(userId: number) {
    return await this.notificationStatusRepository.find({ userId });
  }

  async update(
    userId: number,
    uuid: string,
    status: 'read' | 'unread' | 'deleted'
  ) {
    await this.notificationStatusRepository.update(
      { userId, uuid },
      { status }
    );
    return await this.notificationStatusRepository.findOne({ uuid });
  }
}
