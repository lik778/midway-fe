import { PRODUCTION_ENV } from '../config';

export const isProd = () => {
  return process.env.NODE_ENV === PRODUCTION_ENV
}
