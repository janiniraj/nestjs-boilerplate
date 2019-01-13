import { Logger } from '@nestjs/common';
import * as cls from 'cls-hooked';
import * as winston from 'winston';
import * as dayjs from 'dayjs';
import chalk from 'chalk';
import { REQUEST_ID } from 'src/common/constants';
import { SessionMiddleware } from 'src/common/middleware/session.middleware';

const formatter = (info) => {
  const requestId = SessionMiddleware.get(REQUEST_ID) || '-';

  return `${dayjs(info.timestamp).format(
    'YYYY/MM/DD - hh:mm:ss.SSS A'
  )} ${chalk.magentaBright(requestId)} [${info.level}] ${info.message}`;
};

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.padLevels(),
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

  log(message: string) {
    EmmLogger.winstonLogger.log('debug', message);
    super.log(message);
  }

  warn(message: string) {
    EmmLogger.winstonLogger.log('warn', message);
    super.warn(message);
  }

  error(message: string, trace: string) {
    EmmLogger.winstonLogger.log('error', message);
    super.error(message, trace);
  }
}
