import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { EmailerService } from './emailer.service';
import { BackendLogger } from 'src/logger/BackendLogger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';

@Resolver('Emailer')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class EmailerResolver {
  private readonly logger = new BackendLogger(EmailerResolver.name);

  constructor(private readonly emailerService: EmailerService) {}
}
