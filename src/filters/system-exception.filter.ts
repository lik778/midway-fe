// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Request, Response } from 'express'
import config from '../config';
import { SystemException } from '../exceptions/system.exception'
import { sentryCaptureException } from '../util/sentry';

@Catch()
export class SystemExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const newSystemException = new SystemException(500, false, exception)
    sentryCaptureException(newSystemException);
    const errorTitle = '出错了'
    res.status(500).render('common/500', { title: errorTitle, exceptionRes: '', haojingHost: config().haojing })
  }
} 