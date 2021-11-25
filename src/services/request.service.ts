import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LogService } from './log.service';
import { toPlainObject } from '../util/common'
import { PageException } from '../exceptions/page.exception';
import { ApiException } from '../exceptions/api.exception';
import * as request from 'request'
import * as qs from 'querystring'

@Injectable()
export class RequestService {
  private landPageRequestRegExp = /midway\/frontend/;
  constructor(private readonly httpService: HttpService,
    private readonly logService: LogService) {
  }

  private errorHandle(err: any, type: 'get' | 'post' | 'put' | 'delete', url: string, data: any, headers?: any,): void {
    this.logService.errorLog(err)
    if (err.isAxiosError) {
      if (err.response) {
        const { message, code, success } = err.response.data
        if (this.landPageRequestRegExp.test(url)) {
          throw new PageException(code, success, message, `request.service ${type} PageException 1`, { url, data, headers });
        } else {
          throw new ApiException(code, success, message, `request.service ${type} ApiException 1`, { url, data, headers });
        }
      } else {
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, `请求没有返回，response为undefined
          ${err}`, `request.service ${type} ApiException 2`, { url, data, headers });
      }
    } else {
      if (this.landPageRequestRegExp.test(url)) {
        throw new PageException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常', `request.service ${type} PageException 2`, { url, data, headers });
      } else {
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常', `request.service ${type} ApiException 3`, { url, data, headers });
      }
    }
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
      .catch((err) => {
        this.errorHandle(err, 'get', url, params, headers)
      })
  }

  public post(url: string, data: any, headers?: any, config?: AxiosRequestConfig): Promise<any> {
    const options = config ? { headers, timeout: config.timeout } : { headers }
    return new Promise((resolve, reject) => {
      this.httpService.post(url, typeof data === 'number' ? data.toString() : data, {
        ...options,
        maxContentLength: Infinity,
      }).toPromise().then((res: AxiosResponse) => {
        resolve(res.data)
      }).catch((err: AxiosError) => reject(err))
    })
      .catch((err) => {
        this.errorHandle(err, 'post', url, data, headers)
      })
  }

  public put(url: string, data: any, headers?: any, config?: AxiosRequestConfig): Promise<any> {
    const options = config ? { headers, timeout: config.timeout } : { headers }
    return new Promise((resolve, reject) => {
      this.httpService.put(url, typeof data === 'number' ? data.toString() : data, options).toPromise().then((res: AxiosResponse) => {
        resolve(res.data)
      }).catch((err: AxiosError) => reject(err))
    })
      .catch((err) => {
        this.errorHandle(err, 'post', url, data, headers)
      })
  }

  public delete(url: string, params: any, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      /**
       * axios.request get 请求中的 params 参数必须是无格式对象或者字符串
       * @see http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
       */
      const querys = toPlainObject(params)
      this.httpService.delete(url, { params: querys, headers }).toPromise().then((res: AxiosResponse) => {
        resolve(res?.data)
      }).catch((err: AxiosError) => reject(err))
    })
      .catch((err) => {
        this.errorHandle(err, 'delete', url, params, headers)
      })
  }

  public downloadFile(url: string, params: {[key:string]: string}, headers?: any) {
    const querystring = qs.stringify(params);
    console.log(`${url}${querystring?'?'+querystring:''}`)
    console.log({
      ...headers,
      'Content-Type': 'application/octet-stream'
    })
    return request.get({
      url: `${url}${querystring?'?'+querystring:''}`,
      gzip: true,
      headers: {
        ...headers,
        'Content-Type': 'application/octet-stream'
      },
    })
  }
}

