import { Test } from '@nestjs/testing';
import { NotificationStatusService } from './notificationStatus.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationStatus } from './notificationStatus.entity';
import { NotificationStatusRepoFixture } from './fixtures/notificationStatusRepoFixture';
import {
  fakeNum,
  fakeWord,
  fakeWords,
  fakeUuid
} from 'src/common/testing/fakes';
import { notificationStatusEntity } from './fixtures/notificationStatusFixture';

describe('NotificationStatusService', () => {
  let notificationStatusService: NotificationStatusService;
  let fakeNotificationStatus: NotificationStatus;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NotificationStatusService,
        {
          provide: getRepositoryToken(NotificationStatus),
          useClass: NotificationStatusRepoFixture
        }
      ]
    }).compile();

    notificationStatusService = module.get<NotificationStatusService>(
      NotificationStatusService
    );
    jest.mock('./fixtures/notificationStatusRepoFixture');
    fakeNotificationStatus = notificationStatusEntity;
  });

  describe('createNotification', () => {
    it('should create a user notification', async () => {
      expect(
        await notificationStatusService.createNotification({
          userIds: [fakeNum(), fakeNum()],
          title: fakeWord(),
          notificationHtml: fakeWords()
        })
      ).toBe('Success');
    });
  });

  describe('findAll', () => {
    it('should find all for a given user id', async () => {
      expect(await notificationStatusService.findAll(fakeNum())).toEqual([
        fakeNotificationStatus
      ]);
    });
  });

  describe('update', () => {
    it('should update a notification to a new status', async () => {
      expect(
        await notificationStatusService.update(fakeNum(), fakeUuid(), 'read')
      ).toEqual(fakeNotificationStatus);
    });
  });
});
