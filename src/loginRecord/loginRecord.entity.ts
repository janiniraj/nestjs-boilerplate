import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class LoginRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  time: Date;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column()
  lat: number;

  @Column()
  long: number;

  @Column()
  ip: string;

  @ManyToOne((type) => User, (user) => user.loginRecords)
  user: User;

  @Column()
  userId: number;
}
