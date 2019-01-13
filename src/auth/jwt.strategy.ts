import { AuthService } from './auth.service';
import { EmmLogger } from 'src/logger/EmmLogger';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { PassportStrategy } from '@nestjs/passport';
import { SESSION_USER } from 'src/common/constants';
import { SessionMiddleware } from 'src/common/middleware/session.middleware';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new EmmLogger(JwtStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.APP_KEY
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    // SessionMiddleware.set(SESSION_USER, user);
    return user;
  }
}
