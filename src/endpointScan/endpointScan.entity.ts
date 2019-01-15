
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EndpointScan {
  @PrimaryGeneratedColumn()
  id: number;
}