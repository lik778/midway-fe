import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { PageException } from '../exceptions/page.exception';
import config from '../config';
import { sentryCaptureException } from '../util/sentry';

@Catch(PageException)
export class SiteExceptionFilter implements ExceptionFilter {
  catch(exception: PageException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    sentryCaptureException(exception);
    const code = exception.getCode()
    const is404 = Boolean(code === 404)
    const errorUrl = is404 ? 'common/404' : 'common/500'
    const errorTitle = is404 ? '页面不存在' : '出错了'
    const errorCode = is404 ? 404 : 500
    res.status(errorCode).render(errorUrl, { title: errorTitle, exceptionRes: exception, haojingHost: config().haojing })
  }
}
