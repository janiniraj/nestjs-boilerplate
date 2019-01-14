import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

import { BackendLogger } from 'src/logger/BackendLogger';
import { readFileSync } from 'fs';
import { SendDto } from './dtos/send.dto';
import { MailOptions } from 'nodemailer/lib/smtp-pool';
import { loggers } from 'winston';
import { isDevEnv } from 'src/common/utils';

@Injectable()
export class EmailerService {
  private readonly logger = new BackendLogger(EmailerService.name);

  async send({ subject, title, body, to, cc, bcc, from }: SendDto) {
    const transporter = await this.getTransporter();
    const mailOptions: MailOptions = {
      from,
      to,
      cc,
      bcc,
      html: this.compileTemplate(subject, title, body)
    };

    const result = await transporter.sendMail(mailOptions);
    this.logger.debug(`Sent email: ${JSON.stringify(result.messageId)}`);
    if (isDevEnv()) {
      this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(result)}`);
    }
  }

  private async getTransporter() {
    if (process.env.NODE_ENV === 'development') {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } else {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
  }

  private compileTemplate(subject: string, title: string, body: string) {
    const templateHtml = readFileSync(
      __dirname + '/templates/general.html',
      'utf-8'
    );
    return templateHtml
      .replace('${subject}', subject)
      .replace('${title}', title)
      .replace('${body}', body);
  }
}
