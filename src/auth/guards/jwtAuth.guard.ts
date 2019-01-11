import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmmLogger } from 'src/logger/logger';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new EmmLogger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('Verifying user');
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
