import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { sentryCaptureException } from '../util/sentry';
import { Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    sentryCaptureException(exception);
    res.send('网络异常，请重试')
  }
}
