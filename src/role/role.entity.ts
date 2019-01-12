import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  enabled: boolean;

  @ManyToOne((type) => User, (user) => user.roles)
  user: User;

  @Column()
  userId: number;
}
