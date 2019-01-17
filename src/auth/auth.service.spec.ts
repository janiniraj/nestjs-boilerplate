import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { user } from './fixtures/user';
import { userServiceFixture } from 'src/common/testing/fixtures/userServiceFixture';
import { jwtServiceFixture } from 'src/common/testing/fixtures/jwtServiceFixture';
import { TOKEN_EXPIRES_IN } from 'src/common/constants';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, userServiceFixture, jwtServiceFixture]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    jest.spyOn(userService, 'findOneByEmail').mockReturnValue(user);
    jest.spyOn(userService, 'save').mockReturnValue(user);
  });

  describe('login', () => {
    it('should login a user properly', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => true);

      expect(await authService.login('test@test.com', 'pass')).toMatchObject({
        expiresIn: TOKEN_EXPIRES_IN,
        accessToken: expect.any(String)
      });
    });

    it('should fail to login when a bad password is given', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => false);
      try {
        await authService.login('test@test.com', 'pass');
      } catch (err) {
        expect(err.message).toBe('Invalid email/password');
      }
    });
  });
});
