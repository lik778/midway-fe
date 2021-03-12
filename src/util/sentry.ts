import * as Sentry from '@sentry/minimal';
import { isProd } from './common';

export const sentryCaptureException = (exception: any) => {
  if (isProd()) {
    Sentry.captureException(exception);
  } else {
    console.log(exception);
  }
}
