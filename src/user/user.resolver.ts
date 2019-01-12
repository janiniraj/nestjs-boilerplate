import { Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { EmmLogger } from 'src/logger/logger';

@Resolver('User')
export class UserResolver {
  private readonly logger = new EmmLogger(UserResolver.name);

  constructor(private readonly userService: UserService) {}

  @Query()
  async user() {
    return this.userService.findOneByEmail('test@kryptowire.com');
  }
}
