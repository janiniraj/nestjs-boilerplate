import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';

import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/createUser.dto';
import { BackendLogger } from 'src/logger/BackendLogger';

@Injectable()
export class UserService {
  private readonly logger = new BackendLogger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['roles']
    });
  }

  async save(user: User) {
    return await this.userRepository.save(user);
  }

  async create(createUserDto: UserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async handleInvalidPassword(user: User) {
    user.loginAttempts = user.loginAttempts + 1;

    if (user.loginAttempts > 5) {
      this.logger.warn(
        `User entered invalid password too many times: ${user.email}`
      );
      user.locked = true;
    }

    await this.userRepository.save(user);
  }

  async handleSuccessfulLogin(user: User) {
    user.lastLogin = new Date(dayjs().toISOString());
    user.loginAttempts = 0;

    await this.save(user);
  }
}
