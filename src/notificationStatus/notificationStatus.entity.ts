import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Notification } from 'src/notification/notification.entity';

@Entity()
export class NotificationStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'unread' })
  status: 'read' | 'deleted' | 'unread';

  @Column()
  @Generated('uuid')
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.notifications)
  user?: User;
  @Column()
  userId?: number;

  @OneToOne((type) => Notification, { cascade: true })
  @JoinColumn()
  notification?: Notification;
  @Column()
  notificationId?: number;
}
