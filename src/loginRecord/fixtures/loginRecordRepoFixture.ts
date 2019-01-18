import { loginRecordEntity } from './loginRecordFixture';

export class LoginRecordRepoFixture {
  find() {
    return [loginRecordEntity];
  }

  save() {
    return loginRecordEntity;
  }

  create() {
    return loginRecordEntity;
  }
}
