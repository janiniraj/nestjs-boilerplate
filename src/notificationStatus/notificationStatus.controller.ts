
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
import { NotificationStatusService } from './notificationStatus.service';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { roles } from 'src/common/constants';
import { Roles } from 'src/role/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@Controller('notificationStatus')
@UseGuards(RolesGuard)
export class NotificationStatusController {
  private readonly logger = new BackendLogger(NotificationStatusController.name);

  constructor(private readonly notificationStatusService: NotificationStatusService) {}
}