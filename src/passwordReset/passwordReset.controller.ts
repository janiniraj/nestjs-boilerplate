import { Controller, Post, Body, Patch } from '@nestjs/common';

import { BackendLogger } from 'src/logger/BackendLogger';
import { CreateResetDto } from './dtos/createReset.dto';
import { PasswordResetService } from './passwordReset.service';
import { ResetDto } from './dtos/reset.dto';

@Controller('password-reset')
export class PasswordResetController {
  private readonly logger = new BackendLogger(PasswordResetController.name);

  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post()
  async createPasswordReset(@Body()
  {
    email
  }: CreateResetDto) {
    return await this.passwordResetService.createPasswordResetToken(email);
  }

  @Patch()
  async resetPassword(@Body()
  {
    newPassword,
    newPasswordDupe,
    token,
    email
  }: ResetDto) {
    return await this.passwordResetService.resetPassword(
      email,
      token,
      newPassword,
      newPasswordDupe
    );
  }
}
