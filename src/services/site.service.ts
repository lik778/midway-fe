import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestService } from './request.service';
import { PageHeaderParams, ServiceResponse, ShopComponents } from '../interface';
import { LogService } from './log.service';

@Injectable()
export class SiteService {
  private haojingHost: string;
  private prefixPath: string;
  //定义：后端传的模板id对应的前端模板类型
  static templateMapping = {
    "5fb387d2f2db3f6b8e7080e5": "site-template-1",
    "5fb387d2f2db3f6b8e7080e6": "site-template-2"
  }
  constructor(
    private readonly httpService: HttpService,
    private readonly requestService: RequestService,
    private readonly logService: LogService,
    private readonly configService: ConfigService) {
    this.haojingHost = configService.get('haojing');
    const host = configService.get('services.midway-service.host');
    this.prefixPath = `${host}/api/midway/frontend`
  }


  public getShopName(shopName: string): string {
    if (shopName) {
      return shopName;
    } else {
      throw new HttpException('店铺不存在', HttpStatus.NOT_FOUND)
    }
  }

  private setPageHeaders(shopName: string, device: string, domain: string): PageHeaderParams {
    /**切换domain.根据后端分支和模板类型选择 */

    if (domain === 'localhost' || domain ==='dianpu.baixing.cn') {
      /*后端在test分支，且店铺类型是是模板2，B2B模板，使用这个domain*/
      //domain = 'agui.shop-test.baixing.cn'

      /*后端在test分支，且店铺类型是是模板1，B2c模板，使用这个domain*/
      //domain = 'shop-test.baixing.cn'

      /*后端在dev分支，且店铺类型是是模板2，B2B模板，使用这个domain*/
      domain = 'agui.shop.baixing.cn'

      /*后端在dev分支，且店铺类型是是模板1，B2B模板，使用这个domain*/
      //domain = 'shop.baixing.cn'

    }
    return {
      'x-api-shop-name': shopName || '',
      'x-api-device': device || '',
      'x-api-domain': domain || ''
    }
  }

  public getHomePageData(shopName: string, device: string, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/home/`, {},
      this.setPageHeaders(shopName, device, domain));
  }
//服务内容列表
  public getProductPageData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/product/list`, params,
      this.setPageHeaders(shopName, device, domain));
  }

//服务内容子分类
  public getProductCateData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/product/cateList`, params,
      this.setPageHeaders(shopName, device, domain));
  }

//服务内容详情页
public getProductDetailData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
  return this.requestService.post(`${this.prefixPath}/product/detail`, params,
    this.setPageHeaders(shopName, device, domain));
}

//新闻列表
  public getNewsPageData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/article/list`, params,
      this.setPageHeaders(shopName, device, domain));
  }

//新闻列表子分类
public getNewsCateData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
  return this.requestService.post(`${this.prefixPath}/article/cateList`, params,
    this.setPageHeaders(shopName, device, domain));
}

//新闻详情页
public getNewsDetailData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
  return this.requestService.post(`${this.prefixPath}/article/detail`, params,
    this.setPageHeaders(shopName, device, domain));
}

//关于我们页面
public getAboutPageData(shopName: string, device: string, domain: string): Promise<ServiceResponse<ShopComponents>> {
  return this.requestService.post(`${this.prefixPath}/about/`, {},
    this.setPageHeaders(shopName, device, domain));
}

//留言资讯
public leaveLeads(shopName: string, device: string, params: any, domain: string): Promise<any> {
  return this.requestService.post(`${this.prefixPath}/home/message`, params,
  this.setPageHeaders(shopName, device, domain));
}
}
