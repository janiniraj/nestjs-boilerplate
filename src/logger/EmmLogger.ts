import { Logger } from '@nestjs/common';

export class EmmLogger extends Logger {
  log(message: string) {
    super.log(message);
  }

  warn(message: string) {
    super.warn(message);
  }

  error(message: string, trace: string) {
    super.error(message, trace);
  }
}
