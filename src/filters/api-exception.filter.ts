import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ApiException } from '../exceptions/api.exception';
import { Response } from 'express';
import { sentryCaptureException } from '../util/sentry';

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: ApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    sentryCaptureException(exception);
    res.send(exception);
  }
}
