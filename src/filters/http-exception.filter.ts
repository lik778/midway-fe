import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import config from '../config'
import { sentryCaptureException } from '../util/sentry';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let exceptionRes = exception.getResponse();
    // 做一下转换处理
    if (typeof exceptionRes === 'string') {
      exceptionRes = { message: exceptionRes, code: status, success: false }
    }
    sentryCaptureException(exception);
    if (status === HttpStatus.NOT_FOUND) {
      if (req.url.includes('api')) {
        res.send('请求接口不存在');
        return
      } else {
        res.status(404).render('common/404', { title: '页面找不到', haojingHost: config().haojing })
        return
      }
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      if (req.url.includes('api')) {
        res.send(exceptionRes);
        return
      } else {
        res.status(500).render('common/500', { title: '出错了', exceptionRes, haojingHost: config().haojing })
        return
      }
    }

  }
}
