import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { NotificationStatus } from 'src/notificationStatus/notificationStatus.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bodyHtml: string;

  @Column()
  title: string;

  @OneToOne((type) => NotificationStatus)
  notificationStatus: NotificationStatus;
}
