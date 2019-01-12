import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/role.entity';

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

  @OneToMany((type) => Role, (role) => role.user)
  roles: Role[];

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
    return this;
  }
}
