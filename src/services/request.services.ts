import { Injectable } from '@nestjs/common';
import { RequestServiceInterface } from './interfaces/request-service.interface';

@Injectable()
export class RequestService implements RequestServiceInterface {

  get(url: string): string {
    return '';
  }

  post(url: string, params: any): any {
    return ''
  }
}
