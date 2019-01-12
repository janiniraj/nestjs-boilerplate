import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { EmmLogger } from 'src/logger/logger';
import { RoleService } from './role.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/common/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/common/guards/graphqlRoles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { roles } from 'src/common/constants';

@Resolver('Role')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class RoleResolver {
  private readonly logger = new EmmLogger(RoleResolver.name);

  constructor(private readonly roleService: RoleService) {}

  @Mutation()
  @Roles(roles.ADMIN)
  async createRole(
    @Args('userId') userId: number,
    @Args('name') name: string,
    @Args('enabled') enabled: boolean
  ) {
    this.logger.log(`Creating role ${name} for user ${userId}`);

    return await this.roleService.createRole({ userId, name, enabled });
  }
}
