const crypto = require('crypto')
import { PRODUCTION_ENV } from '../config';

export const isProd = () => {
  return process.env.NODE_ENV === PRODUCTION_ENV
}

export const md5 = (str, digest = 'hex') => {
  return crypto.createHash('md5').update(str).digest(digest)
}