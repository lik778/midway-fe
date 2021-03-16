import * as Sentry from '@sentry/node';
import { PRODUCTION_ENV } from '../config';

Sentry.init({
  environment: PRODUCTION_ENV,
  release: `midway-fe`,
  dsn: 'http://edaf3c65f6234fd4ac97cd770058a706:d6eba20b8d3c403e957e21dfa2221390@sentry.baixing.cn/169'
})

export default Sentry
