import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards, Req } from '@nestjs/common';

import { UserService } from './user.service';
import { EmmLogger } from 'src/logger/logger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Resolver('User')
export class UserResolver {
  private readonly logger = new EmmLogger(UserResolver.name);

  constructor(private readonly userService: UserService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async user(@Context('req') req) {
    return this.userService.findOneByEmail(req.user.email);
  }
}
