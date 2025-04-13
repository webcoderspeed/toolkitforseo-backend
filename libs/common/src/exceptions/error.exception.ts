import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const request = ctx.getRequest();

    const exceptionResponse = exception.getResponse() as
      | string
      | { [key: string]: unknown };

    const error =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : exceptionResponse;

    this.logger.error(error);

    response.status(status).json({
      success: false,
      path: request.url,
      exception: Array.isArray(error)
        ? Object.fromEntries(error.map((e) => [e.property, e.constraints]))
        : error,
      stack: process.env.NODE_ENV === 'production' ? null : exception.stack,
    });
  }
}
