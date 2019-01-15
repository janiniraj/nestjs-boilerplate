import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveProperty
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { NotificationStatusService } from './notificationStatus.service';
import { BackendLogger } from 'src/logger/BackendLogger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';
import { CreateNotificationDto } from './dtos/createNotification.dto';
import { Roles } from 'src/role/decorators/roles.decorator';
import { roles } from 'src/common/constants';
import { User } from 'src/user/user.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationStatus } from './notificationStatus.entity';

@Resolver('NotificationStatus')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class NotificationStatusResolver {
  private readonly logger = new BackendLogger(NotificationStatusResolver.name);

  constructor(
    private readonly notificationStatusService: NotificationStatusService,
    private readonly notificationService: NotificationService
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

  @ResolveProperty()
  async notification(@Parent() notificationStatus: NotificationStatus) {
    return await this.notificationService.findOneById(
      notificationStatus.notificationId
    );
  }
}
