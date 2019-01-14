import { IsEmail, IsString } from 'class-validator';

export class ResetDto {
  @IsEmail()
  email: string;
  @IsString()
  newPassword: string;
  @IsString()
  newPasswordDupe: string;
  @IsString()
  token: string;
}
