import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { EmmLogger } from 'src/logger/logger';
import { LoginDto } from './interfaces/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new EmmLogger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    return await this.authService.login(email, password);
  }
}
