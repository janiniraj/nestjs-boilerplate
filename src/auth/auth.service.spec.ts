import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { userEntity } from '../common/testing/fixtures/userFixture';
import { userServiceFixture } from 'src/common/testing/fixtures/userServiceFixture';
import { jwtServiceFixture } from 'src/common/testing/fixtures/jwtServiceFixture';
import { TOKEN_EXPIRES_IN } from 'src/common/constants';
import { fakeEmail, fakePassword } from 'src/common/testing/fakes';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, userServiceFixture, jwtServiceFixture]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    jest.spyOn(userService, 'findOneByEmail').mockReturnValue(userEntity);
    jest.spyOn(userService, 'save').mockReturnValue(userEntity);
    userService.handleInvalidPassword = jest.fn();
  });

  describe('login', () => {
    it('should login a user properly', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => true);

      expect(
        await authService.login(fakeEmail(), fakePassword())
      ).toMatchObject({
        expiresIn: TOKEN_EXPIRES_IN,
        accessToken: expect.any(String)
      });
    });

    it('should fail to login when a bad password is given', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => false);
      try {
        await authService.login(fakeEmail(), fakePassword());
      } catch (err) {
        expect(userService.handleInvalidPassword).toBeCalled();
        expect(err.message).toBe('Invalid email/password');
      }
    });

    it('should fail to login when an invalid email address is given', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockImplementation(() => false);
      try {
        await authService.login(fakeEmail(), fakePassword());
      } catch (err) {
        expect(userService.handleInvalidPassword).not.toBeCalled();
        expect(err.message).toBe('Invalid email/password');
      }
    });

    it('should fail to login if the user account is locked', async () => {
      userEntity.locked = true;
      jest.spyOn(userService, 'findOneByEmail').mockReturnValue(userEntity);
      try {
        await authService.login(fakeEmail(), fakePassword());
      } catch (err) {
        expect(userService.handleInvalidPassword).not.toBeCalled();
        expect(err.message).toBe('Account locked');
      }
    });
  });

  describe('validateUser', () => {
    it('should properly validate a user when one is found via payload', async () => {
      expect(await authService.validateUser({ email: fakeEmail() })).toEqual(
        userEntity
      );
    });

    it('should throw an error when validating the payload if we cannot find the user', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockReturnValue(false);
      try {
        await authService.validateUser({ email: fakeEmail() });
      } catch (err) {
        expect(err.message).toBe('Invalid token');
      }
    });
  });
});
