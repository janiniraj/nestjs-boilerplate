import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { EmmLogger } from 'src/logger/logger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';

@Resolver('User')
export class UserResolver {
  private readonly logger = new EmmLogger(UserResolver.name);

  constructor(private readonly userService: UserService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async user() {
    return this.userService.findOneByEmail('test@kryptowire.com');
  }
}
