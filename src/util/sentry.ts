import * as Sentry from '@sentry/minimal';
import { isProd } from './common';

export const sentryCaptureException = (exception: any) => {
  if (isProd()) {
    Sentry.captureException(exception, {
      extra: {
        info: exception.info,
        type: exception.type
      }
    });
  } else {
    console.log('sentryCaptureException:', exception);
  }
}
