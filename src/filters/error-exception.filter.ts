import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { sentryCaptureException } from '../util/sentry';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    sentryCaptureException(exception);
    ctx.getNext()();
  }
}
