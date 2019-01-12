import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EmmLogger } from 'src/logger/EmmLogger';
import { UserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { roles } from 'src/common/constants';
import { Roles } from 'src/role/decorators/roles.decorator';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  private readonly logger = new EmmLogger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(roles.ADMIN)
  async createUser(@Body(new ValidationPipe()) createUserDto: UserDto) {
    this.logger.log(`Creating new user: ${createUserDto.email}`);
    return await this.userService.createUser(createUserDto);
  }
}
