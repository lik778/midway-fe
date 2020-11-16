import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RequestServiceInterface } from './interfaces/request-service.interface';

@Injectable()
export class RequestService implements RequestServiceInterface {

  get(url: string, params?: any): Promise<any> {
      return new Promise((resolve, reject) =>{
        axios.get(url, { params }).then(res => {
          resolve(res.data);
        }).catch(err =>{
          console.log(err)
          reject(err)
        })
    })
  }

  post(url: string, body: any): Promise<any>  {
    return new Promise((resolve, reject) =>{
      axios.get(url, { ...body }).then(res => {
        resolve(res.data);
      }).catch(err =>{
        reject(err)
      })
    })
  }
}
