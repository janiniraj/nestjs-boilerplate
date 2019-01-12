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
import { GqlAuthGuard } from 'src/common/guards/graphqlAuth.guard';
import { RoleService } from 'src/role/role.service';
import { User } from './user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Resolver('User')
@UseGuards(GqlAuthGuard)
export class UserResolver {
  private readonly logger = new EmmLogger(UserResolver.name);

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {}

  @Query()
  async user(@Context('req') { user }) {
    return this.userService.findOneByEmail(user.email);
  }

  @Mutation()
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
}
