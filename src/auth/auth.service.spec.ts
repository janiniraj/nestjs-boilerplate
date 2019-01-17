import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { user } from './fixtures/user';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), UserModule],
      providers: [AuthService, UserService]
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
        expiresIn: '24h',
        accessToken: expect.any(String)
      });
    });
  });
});
