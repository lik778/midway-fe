const crypto = require('crypto')
import { PRODUCTION_ENV } from '../config';

export const isProd = () => {
  return process.env.NODE_ENV === PRODUCTION_ENV
}

export const md5 = (str, digest = 'hex') => {
  return crypto.createHash('md5').update(str).digest(digest)
}

export const stringifyQuery = (res = {}, separator = '&'): string => {
  return Object.entries(res)
    .reduce((h, [k, v]) => {
      const vStr = (v instanceof Array ? v.join(',') : v) as string
      console.log(`${encodeURIComponent(k)}=${encodeURIComponent(vStr)}`)
      h.push(`${encodeURIComponent(k)}=${encodeURIComponent(vStr)}`)
      return h
    }, [] as string[])
    .join(separator)
}

export const toPlainObject = (obj = {}): any => {
  return Object.entries(obj).reduce((h, [k, v]) => {
    h[k] = v instanceof Array
      ? v.join(',')
      : v
    return h
  }, {})
}
