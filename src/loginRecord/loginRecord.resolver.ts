import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LoginRecordService } from './loginRecord.service';
import { EmmLogger } from 'src/logger/EmmLogger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';

@Resolver('User')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class LoginRecordResolver {
  private readonly logger = new EmmLogger(LoginRecordResolver.name);

  constructor(private readonly loginRecordService: LoginRecordService) {}
}
