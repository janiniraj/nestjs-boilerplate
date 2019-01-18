import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepoFixture } from './fixtures/userRepoFixture';
import { UserService } from './user.service';
import { fakeEmail } from 'src/common/testing/fakes';
import { userEntity } from 'src/common/testing/fixtures/userFixture';

describe('UserService', () => {
  let userService: UserService;
  let fakeUser: User;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepoFixture
        }
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    jest.mock('./fixtures/userRepoFixture');
    fakeUser = userEntity;
  });

  it('should find a user by email', async () => {
    expect(await userService.findOneByEmail(fakeEmail())).toEqual(fakeUser);
  });

  it('should save a user', async () => {
    expect(await userService.save(fakeUser)).toEqual(fakeUser);
  });

  it('should create a user', async () => {
    expect(await userService.create(fakeUser)).toEqual(fakeUser);
  });

  it('should handle a successful login', async () => {
    fakeUser.loginAttempts = 1;
    await userService.handleSuccessfulLogin(fakeUser);
    expect(fakeUser.loginAttempts).toBe(0);
  });

  it('should handle an invalid password given', async () => {
    fakeUser.loginAttempts = 0;
    await userService.handleInvalidPassword(fakeUser);
    expect(fakeUser.loginAttempts).toBe(1);
  });

  it('should lock a user account if an incorrect password has been give more than 5 times', async () => {
    fakeUser.loginAttempts = 5;
    await userService.handleInvalidPassword(fakeUser);
    expect(fakeUser.loginAttempts).toBe(6);
    expect(fakeUser.locked).toBeTruthy();
  });
});
