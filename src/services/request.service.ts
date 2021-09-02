import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LogService } from './log.service';
import { toPlainObject } from '../util/common'
import { PageException } from '../exceptions/page.exception';
import { ApiException } from '../exceptions/api.exception';

@Injectable()
export class RequestService {
  private landPageRequestRegExp = /midway\/frontend/;
  constructor(private readonly httpService: HttpService,
    private readonly logService: LogService) {
  }

  public get(url: string, params: any, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      /**
       * axios.request get 请求中的 params 参数必须是无格式对象或者字符串
       * @see http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
       */
      const querys = toPlainObject(params)
      this.httpService.get(url, { params: querys, headers }).toPromise().then((res: AxiosResponse) => {
        resolve(res?.data)
      }).catch((err: AxiosError) => reject(err))
    })
      .catch((err: AxiosError) => {
        this.logService.errorLog(err)
        if (err.isAxiosError) {
          const { message, code, success } = err.response.data
          if (this.landPageRequestRegExp.test(url)) {
            throw new PageException(code, success, message);
          } else {
            throw new ApiException(code, success, message);
          }
        } else {
          if (this.landPageRequestRegExp.test(url)) {
            throw new PageException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常');
          } else {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常');
          }
        }
      })
  }

  public post(url: string, data: any, headers?: any, config?: AxiosRequestConfig): Promise<any> {
    const options = config ? { headers, timeout: config.timeout } : { headers }
    return new Promise((resolve, reject) => {
      this.httpService.post(url, typeof data === 'number' ? data.toString() : data, options).toPromise().then((res: AxiosResponse) => {
        resolve(res.data)
      }).catch((err: AxiosError) => reject(err))
    })
      .catch((err) => {
        this.logService.errorLog(err)
        if (err.isAxiosError) {
          if (err.response) {
            const { message, code, success } = err.response.data
            if (this.landPageRequestRegExp.test(url)) {
              throw new PageException(code, success, message);
            } else {
              throw new ApiException(code, success, message);
            }
          } else {
            throw new ApiException(500, false, '请求没有返回，response为undefined');
          }
        } else {
          if (this.landPageRequestRegExp.test(url)) {
            throw new PageException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常');
          } else {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常');
          }
        }
      })
  }
}
