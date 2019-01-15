import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { BackendLogger } from 'src/logger/BackendLogger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';

@Resolver('Notification')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class NotificationResolver {
  private readonly logger = new BackendLogger(NotificationResolver.name);

  constructor(private readonly notificationService: NotificationService) {}
}
