import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { Command, Positional, Option } from 'nestjs-command';
import { BackendLogger } from 'src/logger/BackendLogger';
import { randomStr } from 'src/common/utils';

@Injectable()
export class UserCommand {
  private readonly logger = new BackendLogger(UserCommand.name);

  constructor(private readonly userService: UserService) {}

  @Command({ command: 'user:create <email>', describe: 'create a new user' })
  async create(
    @Positional({
      name: 'email',
      describe: 'new user email',
      type: 'string'
    })
    email: string
  ) {
    this.logger.log(`Creating new user: ${email}`);
    const password = randomStr(16);

    await this.userService.createUser({ email, password });
    this.logger.log(`Created, generated password: ${password}`);
  }
}
