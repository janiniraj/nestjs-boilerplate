import * as bcrypt from 'bcryptjs';
import * as dayjs from 'dayjs';
import * as owasp from 'owasp-password-strength-test';
import * as randToken from 'rand-token';
import { BackendLogger } from 'src/logger/BackendLogger';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

import { EmailerService } from 'src/emailer/emailer.service';
import { EMAIL_FROM } from 'src/common/constants';

@Injectable()
export class PasswordResetService {
  private readonly logger = new BackendLogger(PasswordResetService.name);

  constructor(
    private readonly userService: UserService,
    private readonly emailerService: EmailerService
  ) {}

  async createPasswordResetToken(email: string) {
    this.logger.log(`Password reset requested for email: ${email}`);
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      this.logger.warn(
        `Password reset requested for email that does not exist: ${email}`
      );
      return;
    }

    const token = randToken.generate(36);

    this.logger.log(`Token created: ${token}`);

    user.resetToken = bcrypt.hashSync(token, 10);
    user.resetTokenExpires = dayjs()
      .add(2, 'hour')
      .toDate();
    this.userService.save(user);

    await this.sendPasswordResetEmail(user, token);

    return;
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
    newPasswordDupe: string
  ) {
    const user: User = await this.userService.findOneByEmail(email);
    this.logger.debug(`Attempting to reset password for: ${user.email}`);
    if (!user) {
      this.logger.warn('Invalid token provided for password reset');
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    if (!user.resetToken) {
      this.logger.warn(
        `User does not have password reset token: ${user.email}`
      );
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    // Check if the token has expired
    this.validateToken(token, user);

    // Check if the new password and its repeated value are the same
    this.validateSamePassword(newPassword, newPasswordDupe, user);

    // Check new password strength
    this.validatePasswordStrength(newPassword, user);

    // Update the password
    user.password = bcrypt.hashSync(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await this.userService.save(user);

    this.logger.log(`Reset password successfully for user: ${user.email}`);
  }

  private validatePasswordStrength(newPassword: string, user: User) {
    const passTestResult = owasp.test(newPassword);
    if (!passTestResult.strong) {
      this.logger.warn(
        `Non-strong password entered for new password, user: ${user.email}`
      );
      throw new HttpException(
        `Invalid new password, errors: ${passTestResult.errors.join(' ')}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private validateSamePassword(
    newPassword: string,
    newPasswordDupe: string,
    user: User
  ) {
    if (newPassword !== newPasswordDupe) {
      this.logger.warn(
        `Passwords do not match for password reset, user: ${user.email}`
      );
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
  }

  private validateToken(token: string, user: User) {
    const isCorrectToken = bcrypt.compareSync(token, user.resetToken);
    if (!isCorrectToken) {
      this.logger.warn(
        `User entered invalid token for password reset: ${user.email}`
      );
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const timeDiff = dayjs(user.resetTokenExpires).diff(dayjs(), 'second');
    if (timeDiff < 0) {
      this.logger.warn(`Token has expired for user: ${user.email}`);
      throw new HttpException('Expired token', HttpStatus.BAD_REQUEST);
    }
  }

  private async sendPasswordResetEmail(user: User, generatedToken: string) {
    await this.emailerService.send({
      subject: '[Kryptowire EMM] Password Reset',
      title: 'Password Reset',
      to: [user.email],
      from: EMAIL_FROM,
      snippet: 'password-reset',
      params: {
        token: generatedToken
      }
    });
  }
}
