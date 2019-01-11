import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { EmmLogger } from 'src/logger/logger';
import { LoginDto } from './interfaces/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  private readonly logger = new EmmLogger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
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
    if (!this.authService.validatePassword(user, password)) {
      await this.userService.handleInvalidPassword(user);
      throw new HttpException(
        'Invalid email/password',
        HttpStatus.UNAUTHORIZED
      );
    }

    await this.userService.handleSuccessfulLogin(user);

    return this.authService.createToken(user);
  }
}
