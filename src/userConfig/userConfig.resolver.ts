import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';
import { UserConfigService } from './userConfig.service';
import { Roles } from 'src/role/decorators/roles.decorator';
import { roles } from 'src/common/constants';
import { BackendLogger } from 'src/logger/EmmLogger';

@Resolver('UserConfig')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class UserConfigResolver {
  private readonly logger = new BackendLogger(UserConfigResolver.name);

  constructor(private readonly userConfigService: UserConfigService) {}

  @Mutation()
  @Roles(roles.ADMIN)
  async createUserConfig(
    @Args('userId') userId: number,
    @Args('name') name: string,
    @Args('value') value: string,
    @Args('type') type: 'string' | 'number' | 'boolean',
    @Args('userEditable') userEditable: boolean
  ) {
    this.logger.log('Creating config value');
    return await this.userConfigService.createUserConfig({
      userId,
      name,
      value,
      type,
      userEditable
    });
  }
}
