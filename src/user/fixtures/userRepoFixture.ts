import { userEntity } from 'src/common/testing/fixtures/user';

export class UserRepoFixture {
  findOne() {
    return userEntity;
  }

  save() {
    return userEntity;
  }

  create() {
    return userEntity;
  }
}
