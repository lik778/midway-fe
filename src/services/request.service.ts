import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LogService } from './log.service';
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
      this.httpService.get(url, { params, headers }).toPromise().then((res: AxiosResponse) => {
        resolve(res?.data)
      }).catch((err: AxiosError) => reject(err))
    })
      .catch((err) => {
        this.logService.errorLog(err)
        if (err.isAxiosError) {
          if (err.response) {
            const { message, code, success } = err.response.data
            if (this.landPageRequestRegExp.test(url)) {
              throw new PageException(code, success, message, 'request.service get PageException 1', { url, params, headers });
            } else {
              throw new ApiException(code, success, message, 'request.service get ApiException 1', { url, params, headers });
            }
          } else {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, `请求没有返回，response为undefined
          ${err}`, 'request.service get ApiException 2', { url, params, headers });
          }
        } else {
          if (this.landPageRequestRegExp.test(url)) {
            throw new PageException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常', 'request.service get PageException 2', { url, params, headers });
          } else {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常', 'request.service get ApiException 3', { url, params, headers });
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
              throw new PageException(code, success, message, 'request.service post PageException 1', { url, data, headers });
            } else {
              throw new ApiException(code, success, message, 'request.service post ApiException 1', { url, data, headers });
            }
          } else {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, `请求没有返回，response为undefined
          ${err}`, 'request.service post ApiException 2', { url, data, headers });
          }
        } else {
          if (this.landPageRequestRegExp.test(url)) {
            throw new PageException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常', 'request.service post PageException 2', { url, data, headers });
          } else {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, '服务器异常', 'request.service post ApiException 3', { url, data, headers });
          }
        }
      })
  }
}
