import {
  fakeNum,
  fakeDate,
  fakeCountry,
  fakeRegion,
  fakeCity,
  fakeLat,
  fakeIp,
  fakeLong
} from 'src/common/testing/fakes';

export const loginRecordEntity = {
  id: fakeNum(),
  time: fakeDate(),
  country: fakeCountry(),
  region: fakeRegion(),
  city: fakeCity(),
  lat: fakeNum(),
  long: fakeNum(),
  ip: fakeIp()
};
