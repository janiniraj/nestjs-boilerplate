import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Put,
  Patch
} from '@nestjs/common';

import { BackendLogger } from 'src/logger/BackendLogger';
import { ResetDto } from './dtos/reset.dto';
import { PasswordResetService } from './passwordReset.service';

@Controller('password-reset')
export class PasswordResetController {
  private readonly logger = new BackendLogger(PasswordResetController.name);

  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post()
  async createPasswordReset(@Body()
  {
    email
  }: ResetDto) {
    return await this.passwordResetService.createPasswordResetToken(email);
  }

  @Patch()
  async resetPassword(@Body()
  {
    newPassword,
    newPasswordDupe,
    token,
    email
  }: {
    newPassword: string;
    newPasswordDupe: string;
    token: string;
    email: string;
  }) {
    return await this.passwordResetService.resetPassword(
      email,
      token,
      newPassword,
      newPasswordDupe
    );
  }
}
