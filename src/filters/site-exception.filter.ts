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
    res.render('common/500', { title: '出错了', exceptionRes: exception, haojingHost: config().haojing  })
  }
}
