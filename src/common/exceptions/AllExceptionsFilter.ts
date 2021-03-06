import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BackendLogger } from 'src/logger/BackendLogger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new BackendLogger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;

    let message: any;
    if (status === 500) {
      message = 'Server error';
    } else if (typeof exception.message === 'function') {
      message = exception.message();
    } else if (typeof exception.message === 'string') {
      message = exception.message;
    } else if (Array.isArray(exception.message)) {
      message = exception.message.join(', ');
    } else {
      message = 'Server error';
    }

    let trace = '';
    if (exception.trace) {
      trace = exception.trace;
    } else if (exception.stack) {
      trace = exception.stack;
    }

    this.logger.error(exception.message, exception.trace);

    // Log SQL messages
    if (exception.sql) {
      this.logger.error(`On SQL query: ${exception.sql}`, '');
      if (exception.parameters) {
        this.logger.error(
          `With params: ${JSON.stringify(exception.parameters)}`,
          ''
        );
      }
    }

    response.status(status).json({
      status,
      message
    });
  }
}
