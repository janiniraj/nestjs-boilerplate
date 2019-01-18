import * as faker from 'faker';

export const fakeEmail = () => faker.internet.email();
export const fakePassword = () => faker.random.alphaNumeric(16);
export const fakeWord = () => faker.random.word();
export const fakeIp = () => faker.internet.ip();
export const fakeNum = () => faker.random.number(100);
export const fakeDate = () => faker.date.past();
export const fakeCountry = () => faker.address.country();
export const fakeRegion = () => faker.address.county();
export const fakeCity = () => faker.address.city();
export const fakeLat = () => faker.address.latitude();
export const fakeLong = () => faker.address.longitude();
export const fakeUuid = () => faker.random.uuid();
export const fakeWords = () => faker.random.words();
