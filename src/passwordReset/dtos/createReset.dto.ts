import { IsEmail } from 'class-validator';

export class CreateResetDto {
  @IsEmail()
  email: string;
}
