import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class RequestService {
  constructor(private readonly httpService: HttpService) { }

  get(url: string, params?: any): Promise<any> {
      return new Promise((resolve, reject) =>{
        this.httpService.get(url, { params }).toPromise().then(res => {
          resolve(res.data);
        }).catch(err =>{
          reject(err)
        }).catch(err => {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        })
    })
  }

  post(url: string, data: any): Promise<any>  {
    return new Promise((resolve, reject) =>{
      this.httpService.post(url, { data }).toPromise().then(res => {
        resolve(res.data);
      }).catch(err =>{
        reject(err)
      })
    }).catch(err => {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}
