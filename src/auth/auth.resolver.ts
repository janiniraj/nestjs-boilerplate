import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { BackendLogger } from 'src/logger/BackendLogger';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LoginRecordService } from 'src/loginRecord/loginRecord.service';

@Resolver('Auth')
export class AuthResolver {
  private readonly logger = new BackendLogger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly loginRecordService: LoginRecordService
  ) {}

  @Mutation()
  async login(
    @Context('req') req,
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    const token = await this.authService.login(email, password);

    // We'll only get to this point if the login is successful, so we
    // can create a login record now
    const user = await this.userService.findOneByEmail(email);
    await this.loginRecordService.create(req.ip, user.id);

    return token;
  }
}
