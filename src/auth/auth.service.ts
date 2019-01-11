import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from './interfaces/jwtPayload.interface';
import { EmmLogger } from 'src/logger/logger';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new EmmLogger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  validatePassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  async createToken(user: User) {
    const accessToken = this.jwtService.sign({
      email: user.email
    });

    return {
      expiresIn: '24h',
      accessToken
    };
  }
}
