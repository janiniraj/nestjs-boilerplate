import { NotificationStatus } from '../notificationStatus.entity';
import { fakeNum, fakeUuid, fakeDate } from 'src/common/testing/fakes';

export const notificationStatusEntity: NotificationStatus = {
  id: fakeNum(),
  status: 'unread',
  uuid: fakeUuid(),
  createdAt: fakeDate(),
  updatedAt: fakeDate()
};
