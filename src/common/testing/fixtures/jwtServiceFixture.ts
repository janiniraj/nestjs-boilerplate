import * as faker from 'faker';

export const jwtServiceFixture = {
  provide: 'JwtService',
  useValue: {
    sign: () => faker.random.alphaNumeric(36)
  }
};
