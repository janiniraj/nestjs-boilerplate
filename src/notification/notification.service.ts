import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BackendLogger } from 'src/logger/BackendLogger';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new BackendLogger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}
}
