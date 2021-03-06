import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LoginRecordService } from './loginRecord.service';
import { BackendLogger } from 'src/logger/BackendLogger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';

@Resolver('User')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class LoginRecordResolver {
  private readonly logger = new BackendLogger(LoginRecordResolver.name);

  constructor(private readonly loginRecordService: LoginRecordService) {}
}
