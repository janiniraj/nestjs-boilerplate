import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';
import { UserConfigService } from './userConfig.service';
import { Roles } from 'src/role/decorators/roles.decorator';
import { roles } from 'src/common/constants';
import { EmmLogger } from 'src/logger/logger';

@Resolver('UserConfig')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class UserConfigResolver {
  private readonly logger = new EmmLogger(UserConfigResolver.name);

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
    return await this.userConfigService.createUserConfig({
      userId,
      name,
      value,
      type,
      userEditable
    });
  }
}
