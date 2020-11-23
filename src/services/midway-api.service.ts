import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { RequestService } from './request.service';
import { HeaderAuthParams, ManagementReqParams } from '../interface';


@Injectable()
export class MidwayApiService {
  host: string;
  constructor(
    private readonly requestService: RequestService,
    private readonly configService: ConfigService) {
    this.host = configService.get('services.midway-service.host');
  }

  public getManagementData(input: ManagementReqParams, cookies: any): Promise<AxiosResponse<any>> {
    const {  path, params } = input
    const method = input.method.toLocaleLowerCase()
    switch (method) {
      case 'get':
        return this.requestService.get(`${this.host}${path}`, params, this.setApiAHeaders(cookies));
        break;
      case 'post':
        return this.requestService.post(`${this.host}${path}`, params, this.setApiAHeaders(cookies));
        break;
      default:
        throw new HttpException('缺少method方法', HttpStatus.INTERNAL_SERVER_ERROR);
        break;
    }
  }

  private setApiAHeaders(cookies: any): HeaderAuthParams {
    return {
      'X-Api-Hash': cookies && cookies._c,
      'X-Api-User': cookies && cookies._u,
      'X-Api-Token': cookies && cookies._t,
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Api-Src': 'web'
    }
  }

  public getHomeData(path: string, params?: any): Promise<any> {
    return this.requestService.get(`${this.host}${path}`, params);
  }
}
