import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { RequestService } from './request.service';
import { HeaderAuthParams, ManagementReqParams, ServiceResponse, ShopComponents } from '../interface';


@Injectable()
export class MidwayService {
  host: string;
  constructor(
    private readonly requestService: RequestService,
    private readonly configService: ConfigService) {
    this.host = configService.get('services.midway-service.host');
  }

  public getShopName(url: string, shopName: any): string {
    if (/(\w+)\.shop\.baixing\.(cn|com)/.test(url)) {
      return url.split('.')[0]
    } else if (shopName) {
      return shopName;
    } else {
      throw new HttpException('店铺不存在', HttpStatus.NOT_FOUND)
    }
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

  public getHomeData(shopName: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.host}/api/midway/frontend/home/`, {},
      { 'X-Api-Shop-Name': shopName });
  }
}
