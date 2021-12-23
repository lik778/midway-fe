import * as Sentry from '@sentry/minimal';
import { Severity } from '@sentry/node';
import { isProd } from './common';

export const sentryCaptureException = (exception: any) => {
  if (isProd()) {
    const errorCodes = [500]
    const warningCodes = [1020, 1009, 1027]
    let level = Severity.Info
    if (errorCodes.includes(exception.code)) {
      level = Severity.Error
    } else if (warningCodes.includes(exception.code)) {
      level = Severity.Warning
    }
    Sentry.captureException(exception, {
      level,
      extra: {
        info: exception.info,
        type: exception.type,
      }
    });
  } else {
    console.log('sentryCaptureException:', exception);
  }
}
