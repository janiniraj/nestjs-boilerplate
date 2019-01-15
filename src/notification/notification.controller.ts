import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { BackendLogger } from 'src/logger/BackendLogger';
import { NotificationService } from './notification.service';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { roles } from 'src/common/constants';
import { Roles } from 'src/role/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@Controller('notification')
@UseGuards(RolesGuard)
export class NotificationController {
  private readonly logger = new BackendLogger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}
}
