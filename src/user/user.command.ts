import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { Command, Positional } from 'nestjs-command';

@Injectable()
export class UserCommand {
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
    console.log('Creating new user: ', email);
  }
}
