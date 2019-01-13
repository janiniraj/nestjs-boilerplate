import * as dayjs from 'dayjs';
import * as winston from 'winston';
import chalk from 'chalk';
import { Logger } from '@nestjs/common';
import { REQUEST_ID, SESSION_USER } from 'src/common/constants';
import { SessionMiddleware } from 'src/common/middleware/session.middleware';
import { User } from 'src/user/user.entity';

const formatter = (info) => {
  const requestId = SessionMiddleware.get(REQUEST_ID) || '-';
  const user: User = SessionMiddleware.get(SESSION_USER);
  const email = user ? user.email : '-';

  return `${dayjs(info.timestamp).format(
    'YYYY/MM/DD - hh:mm:ss.SSS A'
  )} ${chalk.magentaBright(requestId)} ${email} [${info.level}] [${chalk.green(
    info.context
  )}] ${info.message}`;
};

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.printf((info) => formatter(info))
);

export class EmmLogger extends Logger {
  public static winstonLogger = winston.createLogger({
    level: 'silly',
    format: customFormat,
    transports: [
      new winston.transports.File({
        filename: 'logs/server.tail.log',
        tailable: true
      }),
      new winston.transports.File({
        filename: 'logs/server.log',
        format: winston.format.combine(winston.format.uncolorize()),
        tailable: false
      })
    ]
  });

  private ctx: string;

  constructor(context: string) {
    super(context);

    this.ctx = context;
  }

  log(message: string) {
    this.winstonLog(message, 'debug');
    super.log(message);
  }

  warn(message: string) {
    this.winstonLog(message, 'warn');
    super.warn(message);
  }

  error(message: string, trace: string) {
    this.winstonLog(message, 'error', trace);
    super.error(message, trace);
  }

  winstonLog(
    message: string,
    level: 'debug' | 'warn' | 'error',
    trace?: string
  ) {
    EmmLogger.winstonLogger.log({ level, message, trace, context: this.ctx });
  }
}
