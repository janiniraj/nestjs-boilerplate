import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from './interfaces/jwtPayload.interface';
import { EmmLogger } from 'src/logger/logger';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new EmmLogger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(payload: JwtPayload): Promise<any> {
    this.logger.log(`Validating user with payload: ${JSON.stringify(payload)}`);
    // put some validation logic here
    // for example query user by id/email/username
    return {};
  }

  validatePassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  async createToken(user: User) {
    const accessToken = this.jwtService.sign({ email: user.email });

    return {
      expiresIn: '24h',
      accessToken
    };
  }
}
