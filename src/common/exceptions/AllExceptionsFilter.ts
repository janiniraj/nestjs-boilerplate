import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { EmmLogger } from 'src/logger/EmmLogger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new EmmLogger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;

    let message: string;
    if (typeof exception.message === 'function') {
      message = exception.message();
    } else if (typeof exception.message === 'string') {
      message = exception.message;
    } else {
      message = 'Server error';
    }

    console.log(JSON.stringify(exception));
    this.logger.error(message, exception.trace);

    // Log SQL messages
    if (exception.sql) {
      this.logger.error(`On SQL query: ${exception.sql}`, '');
      if (exception.parameters) {
        this.logger.error(
          `With params: ${exception.parameters.join(', ')}`,
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
