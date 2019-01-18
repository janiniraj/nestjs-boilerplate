import { notificationStatusEntity } from './notificationStatusFixture';

export class NotificationStatusRepoFixture {
  find() {
    return [notificationStatusEntity];
  }

  findOne() {
    return notificationStatusEntity;
  }

  save() {
    return notificationStatusEntity;
  }

  create() {
    return notificationStatusEntity;
  }

  update() {}
}
