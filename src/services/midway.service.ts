import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { RequestService } from './request.service';
import { HeaderAuthParams, ManagementReqParams, PageHeaderParams, ServiceResponse, ShopComponents } from '../interface';


@Injectable()
export class MidwayService {
  host: string;
  constructor(
    private readonly requestService: RequestService,
    private readonly configService: ConfigService) {
    this.host = configService.get('services.midway-service.host');
  }

  public getShopName(shopName: string): string {
    if (shopName) {
      return shopName;
    } else {
      throw new HttpException('店铺不存在', HttpStatus.NOT_FOUND)
    }
    // if (/(\w+)\.shop\.baixing\.(cn|com)/.test(url)) {
    //   return url.split('.')[0]
    // } else if (shopName) {
    //   return shopName;
    // } else {
    //   throw new HttpException('店铺不存在', HttpStatus.NOT_FOUND)
    // }
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
    // tips: 这里等数据全了再放开
    return {
      'X-Api-Hash': process.env.NODE_DEV === 'development' ? '6a725de38491121d1137b7e6ce67c69b2afd0d79' : cookies && cookies._c,
      'X-Api-User': process.env.NODE_DEV === 'development' ? '230276274' : cookies && cookies._u,
      'X-Api-Token': process.env.NODE_DEV === 'development' ? 'ut5fb1e327141203.44681872' : cookies && cookies._t,
      'Content-Type': 'application/json;charset=UTF-8',
    }
  }

  private setPageHeaders(shopName: string, device: string): PageHeaderParams {
    return {
      'X-Api-Shop-Name': shopName,
      'X-Api-Device': device
    }
  }

  public getHomePageData(shopName: string, device: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.host}/api/midway/frontend/home/`, {},
      this.setPageHeaders(shopName, device));
  }
//服务内容列表
  public getProductPageData(shopName: string, device: string, params): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.host}/api/midway/frontend/product/list`, params,
      this.setPageHeaders(shopName, device));
  }

//服务内容子分类
  public getProductCateData(shopName: string, device: string, params): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.host}/api/midway/frontend/product/cateList`, params,
      this.setPageHeaders(shopName, device));
  }

//新闻列表
  public getNewsPageData(shopName: string, device: string, params): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.host}/api/midway/frontend/article/list`, params,
      this.setPageHeaders(shopName, device));
  }

//新闻列表子分类
public getNewsCateData(shopName: string, device: string, params): Promise<ServiceResponse<ShopComponents>> {
  return this.requestService.post(`${this.host}/api/midway/frontend/article/cateList`, params,
    this.setPageHeaders(shopName, device));
}
}
