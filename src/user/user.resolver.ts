import {
  Resolver,
  Query,
  Context,
  ResolveProperty,
  Parent,
  Mutation,
  Args
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { EmmLogger } from 'src/logger/logger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { RoleService } from 'src/role/role.service';
import { User } from './user.entity';
import { Roles } from 'src/role/decorators/roles.decorator';
import { roles } from 'src/common/constants';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';
import { UserConfigService } from 'src/userConfig/userConfig.service';
import { LoginRecordService } from 'src/loginRecord/loginRecord.service';

@Resolver('User')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class UserResolver {
  private readonly logger = new EmmLogger(UserResolver.name);

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly userConfigService: UserConfigService,
    private readonly loginRecordService: LoginRecordService
  ) {}

  @Query()
  async user(@Context('req') { user }) {
    return this.userService.findOneByEmail(user.email);
  }

  @Mutation()
  @Roles(roles.ADMIN)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    return this.userService.createUser({ email, password });
  }

  @ResolveProperty()
  async roles(@Parent() user: User) {
    return await this.roleService.findAll({ userId: user.id });
  }

  @ResolveProperty()
  async configSettings(@Parent() user: User) {
    return await this.userConfigService.findAll({ userId: user.id });
  }

  @ResolveProperty()
  async loginRecords(@Parent() user: User) {
    return await this.loginRecordService.findAll({ userId: user.id });
  }
}
