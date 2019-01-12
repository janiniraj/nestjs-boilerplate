import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { EmmLogger } from 'src/logger/logger';
import { RoleService } from './role.service';

@Resolver('Role')
export class RoleResolver {
  private readonly logger = new EmmLogger(RoleResolver.name);

  constructor(private readonly roleService: RoleService) {}

  @Mutation()
  async createRole(
    @Args('userId') userId: number,
    @Args('name') name: string,
    @Args('enabled') enabled: boolean
  ) {
    this.logger.log(`Creating role ${name} for user ${userId}`);

    return await this.roleService.createRole({ userId, name, enabled });
  }
}
