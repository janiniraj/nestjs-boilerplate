import { Test } from '@nestjs/testing';
import * as geoip from 'geoip-lite';
import { LoginRecordService } from './loginRecord.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginRecord } from './loginRecord.entity';
import { LoginRecordRepoFixture } from './fixtures/loginRecordRepoFixture';
import { fakeIp, fakeNum } from 'src/common/testing/fakes';
import { loginRecordEntity } from './fixtures/loginRecordFixture';

describe('LoginRecordService', () => {
  let loginRecordService: LoginRecordService;
  let fakeLoginRecord: LoginRecord;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LoginRecordService,
        {
          provide: getRepositoryToken(LoginRecord),
          useClass: LoginRecordRepoFixture
        }
      ]
    }).compile();

    loginRecordService = module.get<LoginRecordService>(LoginRecordService);
    jest.mock('./fixtures/loginRecordRepoFixture');
    fakeLoginRecord = loginRecordEntity;
  });

  describe('create', () => {
    it('should create a login record for a user', async () => {
      expect(await loginRecordService.create(fakeIp(), fakeNum())).toEqual(
        fakeLoginRecord
      );
    });

    it('should not create an entry if location info cannot be found', async () => {
      jest.spyOn(geoip, 'lookup').mockReturnValue(false);
      expect(await loginRecordService.create(fakeIp(), fakeNum())).toBeFalsy();
    });
  });

  describe('findAll', () => {
    it('should find all login records', async () => {
      expect(await loginRecordService.findAll({})).toEqual([loginRecordEntity]);
    });
  });
});
