import * as faker from 'faker';
import { User } from 'src/user/user.entity';

export const userEntity: User = {
  id: 1,
  email: 'test@test.com',
  password: '$9aawaefjh23oifhosdf',
  locked: false,
  loginAttempts: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: new Date(),
  group: null,
  resetToken: null,
  resetTokenExpires: null,
  hashPassword() {
    return this;
  }
};
