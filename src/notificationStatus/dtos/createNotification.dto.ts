import { IsArray, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsArray()
  userIds: number[];

  @IsString()
  title: string;

  @IsString()
  notificationHtml: string;
}
