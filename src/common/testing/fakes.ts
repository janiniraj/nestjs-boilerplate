import * as faker from 'faker';

export const fakeEmail = () => faker.internet.email();
export const fakePassword = () => faker.random.alphaNumeric(16);
