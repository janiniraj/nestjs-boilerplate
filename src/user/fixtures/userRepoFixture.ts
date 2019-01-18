import { userEntity } from 'src/common/testing/fixtures/userFixture';

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
