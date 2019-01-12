import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req
} from '@nestjs/common';

import { EmmLogger } from 'src/logger/logger';
import { UserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { roles } from 'src/common/constants';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  private readonly logger = new EmmLogger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: UserDto) {
    this.logger.log(`Creating new user: ${createUserDto.email}`);
    return await this.userService.createUser(createUserDto);
  }
}
