import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req
} from '@nestjs/common';
import { Request } from 'express';

import { EmmLogger } from 'src/logger/logger';
import { UserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { JwtPayload } from 'src/auth/interfaces/jwtPayload.interface';

@Controller('user')
export class UserController {
  private readonly logger = new EmmLogger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req: any) {
    return await this.userService.findOneByEmail(req.user.email);
  }

  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: UserDto) {
    this.logger.log(`Creating new user: ${createUserDto.email}`);
    return await this.userService.createUser(createUserDto);
  }
}
