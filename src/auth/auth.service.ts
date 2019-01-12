import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { JwtPayload } from './interfaces/jwtPayload.interface';
import { EmmLogger } from 'src/logger/EmmLogger';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginRecordService } from 'src/loginRecord/loginRecord.service';

@Injectable()
export class AuthService {
  private readonly logger = new EmmLogger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(email: string, password: string) {
    this.logger.log(`Logging user in: ${email}`);
    const user = await this.userService.findOneByEmail(email);

    // Email was invalid
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new HttpException(
        'Invalid email/password',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Account is locked
    if (user.locked) {
      this.logger.warn(`User attempted to login to locked account: ${email}`);
      throw new HttpException('Account locked', HttpStatus.UNAUTHORIZED);
    }

    // Check password
    if (!this.validatePassword(user, password)) {
      await this.userService.handleInvalidPassword(user);
      throw new HttpException(
        'Invalid email/password',
        HttpStatus.UNAUTHORIZED
      );
    }

    await this.userService.handleSuccessfulLogin(user);

    return this.createToken(user);
  }

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

  async validateToken(token: string) {
    this.logger.log(`Verifying token: ${token}`);
    return jwt.verify(token.split(' ')[1], process.env.APP_KEY);
  }
}
