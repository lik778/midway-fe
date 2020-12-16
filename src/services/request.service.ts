import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { CommonRes } from '../interface';
import { configure, getLogger } from 'log4js';
import { join } from 'path';

@Injectable()
export class RequestService {
  constructor(private readonly httpService: HttpService) {
    configure({
      appenders: {
        file: {
          type: 'dateFile',
          filename: join(__dirname, '..', '../logs/error.log'),
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

  public get(url: string, params: any, headers?: any): Promise<any> {
      return new Promise((resolve, reject) =>{
        this.httpService.get(url, { params, headers }).toPromise().then((res: AxiosResponse) => {
          resolve(res?.data);
        }).catch((err: AxiosError) =>{
          reject(err)
        }).catch((err: AxiosError) => {
          if (err.isAxiosError)  {
            const { message, code, success } = err.response.data
            const commonRes: CommonRes = { message, code, success }
            throw new HttpException(commonRes, HttpStatus.INTERNAL_SERVER_ERROR)
          } else {
            throw new HttpException( '请求失败', HttpStatus.BAD_REQUEST);
          }
        })
    })
  }

  public post(url: string, data: any, headers?: any): Promise<any>  {
    return new Promise((resolve, reject) =>{
      this.httpService.post(url, data, { headers }).toPromise().then((res: AxiosResponse) => {
        resolve(res.data);
      }).catch((err: AxiosError) =>{
        reject(err)
      })
    }).catch((err) => {
      getLogger().error(err)
      if (err.isAxiosError)  {
        const { message, code, success } = err.response.data
        const commonRes: CommonRes = { message, code, success }
        throw new HttpException(commonRes, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        throw new HttpException( '请求失败', HttpStatus.BAD_REQUEST);
      }
    })
  }
}
