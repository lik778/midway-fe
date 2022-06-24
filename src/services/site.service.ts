import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RequestService } from './request.service';
import { PageHeaderParams, HeaderAuthParams, ServiceResponse, ShopComponents } from '../interface';
import { LogService } from './log.service';
import { COOKIE_HASH_KEY, COOKIE_TOKEN_KEY, COOKIE_USER_KEY, COOKIE_CHAOREN_USER_KEY } from '../constant/cookie';
import { apiSecret } from 'src/constant';
export type analyticsParams = {
  ip: string,
  jumpUrl: string
}
@Injectable()
export class SiteService {
  private haojingHost: string;
  private prefixPath: string;
  private midwayPrefixPath: string;
  private analyticsPrefix: string;
  //定义：后端传的模板id对应的前端模板类型
  static templateMapping = {
    "5fb387d2f2db3f6b8e7080e5": "site-template-1",
    "5fb387d2f2db3f6b8e7080e6": "site-template-2",
    "7397650bdc5446a36d6d643e": "site-template-3",
    'f5760fe337070e8b9b8f3fdcd9ca1c32': "site-template-4"
  }
  constructor(
    private readonly httpService: HttpService,
    private readonly requestService: RequestService,
    private readonly logService: LogService,
    private readonly configService: ConfigService) {
    this.haojingHost = configService.get('haojing');
    const host = configService.get('services.midway-service.host');
    this.prefixPath = `${host}/api/midway/frontend`
    this.midwayPrefixPath = `${host}/api/midway/backend`
    this.analyticsPrefix = `${host}/api/midway/internal`
  }

  public shieldCheck(params): Promise<ServiceResponse<any>> {
    return this.requestService.post(`${this.analyticsPrefix}/waf/check`, params, {
      'content-type': 'application/json',
      'x-api-secret': apiSecret
    })
  }
  public async shieldGet(params): Promise<ServiceResponse<any>> {
    return this.requestService.post(`${this.analyticsPrefix}/waf/get`, params, {
      'content-type': 'application/json',
      'x-api-secret': apiSecret
    })
  }

  public getShopName(shopName: string): string {
    if (shopName) {
      return shopName;
    } else {
      throw new HttpException('店铺不存在', HttpStatus.NOT_FOUND)
    }
  }

  // 本地环境时需要对 domain 进行配置
  // 本地需要请求测试环境接口，而测试环境会校验当前的请求是否从对应的域名发出的
  // 例如 dev环境要求 shop-dev.baixing.cn这个域名(后端未修复，暂时无法使用)
  // 例如 test环境要求 shop-test.baixing.cn这个域名
  // 例如 test1环境要求 shop-test1.baixing.cn这个域名
  // 例如 test2环境要求 shop-test2.baixing.cn这个域名
  // 还需要知道店铺的url分有三级域名与无三级域名两种 对应的domain不同
  // 例如 'zmlc2b.shop-test2.baixing.cn'  为 zmlc2b.shop-test2.baixing.cn
  //      'shop-test.baixing.cn/zmlc/'  为 shop-test.baixing.cn
  private getDomain(domain: string): string {
    if (domain === 'localhost' || domain === 'dianpu.baixing.cn' || domain.indexOf('172.17') !== -1 || domain.indexOf('192.168') !== -1) {
      // 可以将自己常用的还有三级域名的url写在下面 注释好
      // domain = 'fangfang.shop-test.baixing.cn'
      // domain = 'zmlc2b.shop-test2.baixing.cn'
      // domain = 'seocheck380.shop-test.baixing.cn'
      domain = 'shop-test.baixing.cn'
    }
    return domain
  }

  private setGetUserInfoHeaders(cookies: any, domain: string): Partial<HeaderAuthParams> {
    /**切换domain.根据后端分支和模板类型选择 */
    return {
      'x-api-hash': (cookies && cookies[COOKIE_HASH_KEY]) || '',
      'x-api-user': (cookies && cookies[COOKIE_USER_KEY]) || '',
      'x-api-token': (cookies && cookies[COOKIE_TOKEN_KEY]) || '',
      'x-api-mask-user': (cookies && cookies[COOKIE_CHAOREN_USER_KEY] && cookies[COOKIE_CHAOREN_USER_KEY].replace(/u/ig, '').split('-')[0]) || '',
      'content-type': 'application/json;charset=UTF-8',
      'x-api-src': 'web'
    }
  }

  public getUserInfo(req: Request, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.midwayPrefixPath}/user/getUserBaseInfo`, {},
      this.setGetUserInfoHeaders(req.cookies, domain));
  }

  private setPageHeaders(shopName: string, device: string, domain: string): PageHeaderParams {
    /**切换domain.根据后端分支和模板类型选择 */
    return {
      'x-api-shop-name': shopName || '',
      'x-api-device': device || '',
      'x-api-domain': this.getDomain(domain) || ''
    }
  }

  public getHomePageData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/home/?semKeyWordFlag=${params.semKeyWordFlag}&cnKeyWordFlag=${params.cnKeyWordFlag}`, {},
      this.setPageHeaders(shopName, device, domain));
  }

  //服务内容列表
  public getProductPageData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/product/list?semKeyWordFlag=${params.semKeyWordFlag}&cnKeyWordFlag=${params.cnKeyWordFlag}`, params,
      this.setPageHeaders(shopName, device, domain));
  }

  //服务内容子分类
  public getProductCateData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/product/cateList?semKeyWordFlag=${params.semKeyWordFlag}&cnKeyWordFlag=${params.cnKeyWordFlag}`, params,
      this.setPageHeaders(shopName, device, domain));
  }

  //服务内容详情页
  public getProductDetailData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/product/detail?semKeyWordFlag=${params.semKeyWordFlag}&cnKeyWordFlag=${params.cnKeyWordFlag}`, params,
      this.setPageHeaders(shopName, device, domain));
  }

  //新闻列表
  public getNewsPageData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/article/list?semKeyWordFlag=${params.semKeyWordFlag}&cnKeyWordFlag=${params.cnKeyWordFlag}`, params,
      this.setPageHeaders(shopName, device, domain));
  }

  //新闻列表子分类
  public getNewsCateData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/article/cateList?semKeyWordFlag=${params.semKeyWordFlag}&cnKeyWordFlag=${params.cnKeyWordFlag}`, params,
      this.setPageHeaders(shopName, device, domain));
  }

  //新闻详情页
  public getNewsDetailData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/article/detail?semKeyWordFlag=${params.semKeyWordFlag}&cnKeyWordFlag=${params.cnKeyWordFlag}`, params,
      this.setPageHeaders(shopName, device, domain));
  }

  //关于我们页面
  public getAboutPageData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/about/?semKeyWordFlag=${params.semKeyWordFlag}&cnKeyWordFlag=${params.cnKeyWordFlag}`, {},
      this.setPageHeaders(shopName, device, domain));
  }

  // 搜索聚合页
  public getSearchPageData(shopName: string, device: string, params, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.prefixPath}/home/search?semKeyWordFlag=${params.semKeyWordFlag}&cnKeyWordFlag=${params.cnKeyWordFlag}`, params,
      this.setPageHeaders(shopName, device, domain));
  }

  //留言资讯
  public leaveLeads(shopName: string, device: string, params: any, domain: string): Promise<any> {
    return this.requestService.post(`${this.prefixPath}/home/message`, params,
      this.setPageHeaders(shopName, device, domain));
  }

  // 用户保障中心提交表单
  public complaint(shopName: string, device: string, domain: string, params): Promise<any> {
    return this.requestService.post(`${this.prefixPath}/home/complaint`, params,
    this.setPageHeaders(shopName, device, domain));
  }
}
