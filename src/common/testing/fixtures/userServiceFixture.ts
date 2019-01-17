export const userServiceFixture = {
  provide: 'UserService',
  useValue: {
    save() {},
    findOneByEmail() {},
    handleSuccessfulLogin() {},
    handleInvalidPassword() {}
  }
};
