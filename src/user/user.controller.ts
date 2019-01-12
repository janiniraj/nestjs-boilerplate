import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EmmLogger } from 'src/logger/logger';
import { UserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { roles } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  private readonly logger = new EmmLogger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser() {
    return await this.userService.findOneByEmail('test@kryptowire.com');
  }

  @Post()
  @Roles(roles.ADMIN)
  async createUser(@Body(new ValidationPipe()) createUserDto: UserDto) {
    this.logger.log(`Creating new user: ${createUserDto.email}`);
    return await this.userService.createUser(createUserDto);
  }
}
