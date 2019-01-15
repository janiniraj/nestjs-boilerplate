import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { NotificationStatusService } from './notificationStatus.service';
import { BackendLogger } from 'src/logger/BackendLogger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';
import { CreateNotificationDto } from './dtos/createNotification.dto';
import { Roles } from 'src/role/decorators/roles.decorator';
import { roles } from 'src/common/constants';

@Resolver('NotificationStatus')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class NotificationStatusResolver {
  private readonly logger = new BackendLogger(NotificationStatusResolver.name);

  constructor(
    private readonly notificationStatusService: NotificationStatusService
  ) {}

  @Mutation()
  @Roles(roles.ADMIN)
  createNotificationStatus(
    @Args('input')
    notificationInput: CreateNotificationDto
  ) {
    this.logger.log(
      `Creating a notification, title: ${notificationInput.title}`
    );
    return this.notificationStatusService.createNotification(notificationInput);
  }
}
