import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { RequestService } from './request.service';
import { HeaderAuthParams, ManagementReqParams, PageHeaderParams, ServiceResponse, ShopComponents } from '../interface';
import { Request, Response } from 'express';
import { ErrorCode } from '../enums/error';
import { LogService } from './log.service';

@Injectable()
export class MidwayService {
  host: string;
  haojingHost: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly requestService: RequestService,
    private readonly logService: LogService,
    private readonly configService: ConfigService) {
    this.host = configService.get('services.midway-service.host');
    this.haojingHost = configService.get('haojing');
  }

  public managementRedirectTo (code: number, res: Response, callback: any) {
    if (code === ErrorCode.ERR_AUTHENTICATION_ARGS) {
      res.redirect(`${this.haojingHost}/oz/login`)
      return
    } else if (code === ErrorCode.ERR_MANAGEMENT) {
      res.redirect(`${this.haojingHost}`)
      return
    } else {
      callback()
    }
  }

  public async canEnterManagement(req: Request, res: Response): Promise<any> {
    return this.httpService.post(`${this.host}/api/midway/backend/shop/init`,{},
      { headers: this.setApiAHeaders(req.cookies)}).toPromise()
  }

  public getShopName(shopName: string): string {
    if (shopName) {
      return shopName;
    } else {
      throw new HttpException('店铺不存在', HttpStatus.NOT_FOUND)
    }
  }

  public getManagementData(req: Request, input: ManagementReqParams): Promise<AxiosResponse<any>> {
    const {  path, params } = input
    const method = input.method.toLocaleLowerCase()
    const shopId: any = req.headers['shop-id']
    switch (method) {
      case 'get':
        return this.requestService.get(`${this.host}${path}`, params, this.setApiAHeaders(req.cookies, shopId));
        break;
      case 'post':
        return this.requestService.post(`${this.host}${path}`, params, this.setApiAHeaders(req.cookies, shopId));
        break;
      default:
        throw new HttpException('缺少method方法', HttpStatus.INTERNAL_SERVER_ERROR);
        break;
    }
  }

  private setApiAHeaders(cookies: any, shopId?: string): HeaderAuthParams {
    const headers =  {
      'x-api-hash': (cookies && cookies.__c) || '',
      'x-api-user': (cookies && cookies.__u) || '',
      'x-api-token': (cookies && cookies.__t) || '',
      'content-type': 'application/json;charset=UTF-8',
      'x-api-src': 'web'
    }
    if (shopId) {
      headers['x-api-shop-id'] = Number(shopId)
    }
    return headers;
  }

  private setPageHeaders(shopName: string, device: string, domain: string): PageHeaderParams {
    return {
      'x-api-shop-name': shopName || '',
      'x-api-device': device || '',
      'x-api-domain': domain || '', // 先默认为后缀
    }
  }

  public getHomePageData(shopName: string, device: string, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.host}/api/midway/frontend/home/`, {},
      this.setPageHeaders(shopName, device, domain));
  }
//服务内容列表
  public getProductPageData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.host}/api/midway/frontend/product/list`, params,
      this.setPageHeaders(shopName, device, domain));
  }

//服务内容子分类
  public getProductCateData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.host}/api/midway/frontend/product/cateList`, params,
      this.setPageHeaders(shopName, device, domain));
  }

//服务内容详情页
public getProductDetailData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
  return this.requestService.post(`${this.host}/api/midway/frontend/product/detail`, params,
    this.setPageHeaders(shopName, device, domain));
}

//新闻列表
  public getNewsPageData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.host}/api/midway/frontend/article/list`, params,
      this.setPageHeaders(shopName, device, domain));
  }

//新闻列表子分类
public getNewsCateData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
  return this.requestService.post(`${this.host}/api/midway/frontend/article/cateList`, params,
    this.setPageHeaders(shopName, device, domain));
}

//新闻详情页
public getNewsDetailData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
  return this.requestService.post(`${this.host}/api/midway/frontend/article/detail`, params,
    this.setPageHeaders(shopName, device, domain));
}
}
