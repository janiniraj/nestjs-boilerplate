import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common';

import { EmmLogger } from 'src/logger/logger';
import { UserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  private readonly logger = new EmmLogger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get()
  async getUser() {
    return await this.userService.findOneByEmail('test@kryptowire.com');
  }

  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: UserDto) {
    this.logger.log(`Creating new user: ${createUserDto.email}`);
    return await this.userService.createUser(createUserDto);
  }
}
