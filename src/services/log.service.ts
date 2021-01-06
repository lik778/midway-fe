import { Injectable } from '@nestjs/common';
import { configure, getLogger } from 'log4js';
import { join } from "path";

@Injectable()
export class LogService {
  constructor() {
    configure({
      appenders: {
        file: {
          type: 'dateFile',
          filename: join(__dirname, '..', '../logs/error'),
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
          layout: {
            type: 'pattern',
            pattern: '%r %p - %m',
          }
        }
      },
      categories: {
        default: {
          appenders: ['file'],
          level: 'error'
        }
      }
    })
  }

  public errorLog(err: any) {
    if (err.isAxiosError)  {
      const resError = err.response.data
      getLogger().error(
        `request: ${JSON.stringify(err.config)}
         response: ${JSON.stringify(resError)}`)
    } else {
      getLogger().error(err)
    }
  }

}
