// http-exception.filter.ts
import { ExceptionFilter, HttpStatus, Catch, ArgumentsHost } from '@nestjs/common'
import { Request, Response } from 'express'
import config from '../config';
import { SystemException } from '../exceptions/system.exception'
import { sentryCaptureException } from '../util/sentry';

@Catch()
export class SystemExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()
    const newSystemException = new SystemException(HttpStatus.INTERNAL_SERVER_ERROR, false, exception, 'system-exception.filter SystemExceptionFilter SystemException 1', JSON.stringify({ url: req.originalUrl, headers: req.headers, systemError: exception }))
    sentryCaptureException(newSystemException);
    const errorTitle = '出错了'
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).render('common/500', { title: errorTitle, exceptionRes: '', haojingHost: config().haojing })
  }
}