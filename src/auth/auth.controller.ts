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

    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new HttpException(
        'Invalid email/password',
        HttpStatus.UNAUTHORIZED
      );
    }

    if (!this.authService.validatePassword(user, password)) {
      throw new HttpException(
        'Invalid email/password',
        HttpStatus.UNAUTHORIZED
      );
    }

    return this.authService.createToken(user);
  }
}
