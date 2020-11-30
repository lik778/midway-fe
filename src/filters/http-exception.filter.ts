import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let exceptionRes = exception.getResponse();

    // 如果是页面找不到，404页面
    if (!req.url.includes('api') && status === HttpStatus.NOT_FOUND) {
       res.render('common/404')
       return
    }

    if (typeof exceptionRes === 'string') { // 遵循CommonRes
      exceptionRes = { message: exceptionRes, code: status, success: false }
    }
    res.status(status).json(exceptionRes);
  }
}
