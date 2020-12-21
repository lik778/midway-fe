import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import config from '../config'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let exceptionRes = exception.getResponse();

    if (typeof exceptionRes === 'string') { // 遵循CommonRes
      exceptionRes = { message: exceptionRes, code: status, success: false }
    }

    // 如果是页面找不到，404页面
    if (!req.url.includes('api') && status === HttpStatus.NOT_FOUND) {
       res.render('common/404', { title: '页面找不到', haojingHost: config().haojing })
       return
    }

    // 接口报错(报错系统还要继续优化),因为包含了落地页接口请求，这里需要剥离一下
    if (req.url.includes('management/api') || req.url.includes('tracker') ||
      req.url.includes('kf53/api') || req.url.includes('sitemap')) {
      // 后台接口返回json
      res.status(status).json(exceptionRes);
    } else {
      // 落地页直接展示报错
      res.render('common/404', { title: '出错啦', exceptionRes, haojingHost: config().haojing  })
    }

  }
}
