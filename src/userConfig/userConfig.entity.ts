import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class UserConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column()
  type: 'boolean' | 'string' | 'number';

  @Column({ default: false })
  userEditable: boolean;

  @ManyToOne((type) => User, (user) => user.configSettings)
  user: User;

  @Column()
  userId: number;
}
