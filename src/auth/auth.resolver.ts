import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { EmmLogger } from 'src/logger/logger';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
  private readonly logger = new EmmLogger(AuthResolver.name);

  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    return this.authService.login(email, password);
  }
}
