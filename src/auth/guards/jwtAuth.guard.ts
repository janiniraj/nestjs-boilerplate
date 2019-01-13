import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmmLogger } from 'src/logger/EmmLogger';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new EmmLogger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    this.logger.debug(` REST ${req.method}, Path: ${req.path}`);

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.debug(
        `Invalid/expired access for user: ${JSON.stringify(user)}`
      );
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
