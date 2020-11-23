import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let exceptionRes = exception.getResponse();
    if (typeof exceptionRes === 'string') { // 遵循CommonRes
      exceptionRes = { message: exceptionRes, code: status, success: false }
    }
    response.status(status).json(exceptionRes);
  }
}
