import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { CommonRes } from '../interface';
import { LogService } from './log.service';

@Injectable()
export class RequestService {
  constructor(private readonly httpService: HttpService,
              private readonly logService: LogService) {
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
      this.logService.errorLog(err)
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
