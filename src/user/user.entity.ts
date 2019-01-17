import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeUpdate
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/role/role.entity';
import { UserConfig } from 'src/userConfig/userConfig.entity';
import { LoginRecord } from 'src/loginRecord/loginRecord.entity';
import { NotificationStatus } from 'src/notificationStatus/notificationStatus.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column('timestamp', { default: null })
  lastLogin: Date;

  @Column({ default: null })
  group: string;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ default: false })
  locked: boolean;

  @Column({ default: null })
  resetToken: string;

  @Column({ default: null })
  resetTokenExpires: Date;

  @OneToMany((type) => Role, (role) => role.user)
  roles?: Role[];

  @OneToMany((type) => UserConfig, (config) => config.user)
  configSettings?: UserConfig[];

  @OneToMany((type) => LoginRecord, (loginRecord) => loginRecord.user)
  loginRecords?: LoginRecord[];

  @OneToMany(
    (type) => NotificationStatus,
    (notificationStatus) => notificationStatus.user
  )
  notifications?: NotificationStatus[];

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
    return this;
  }
}
