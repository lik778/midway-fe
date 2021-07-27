import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RequestService } from './request.service';
import { SemPageHeaderParams, HeaderAuthParams, ServiceResponse, ShopComponents } from '../interface';
import { LogService } from './log.service';
import { COOKIE_HASH_KEY, COOKIE_TOKEN_KEY, COOKIE_USER_KEY, COOKIE_CHAOREN_USER_KEY } from '../constant/cookie';

@Injectable()
export class SemApiService {
  private prefixPath: string;
  private midwayPrefixPath: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly requestService: RequestService,
    private readonly logService: LogService,
    private readonly configService: ConfigService) {
    const host = configService.get('services.midway-service.host');
    this.prefixPath = `${host}/api/midway/frontend`
    this.midwayPrefixPath = `${host}/api/midway/backend`
  }


  public getUid(uid: string): string {
    if (uid) {
      return uid;
    } else {
      throw new HttpException('店铺不存在', HttpStatus.NOT_FOUND)
    }
  }

  // 测试环境需要设置domian
  private getDomain(domain: string): string {
    /**切换domain.根据后端分支和模板类型选择 */

    if (domain === 'localhost' || domain === 'dianpu.baixing.cn' || domain.indexOf('172.17') !== -1) {
      /*后端在test分支，且店铺类型是是模板2，B2B模板，使用这个domain*/
      // domain = 'hongxiny.shop-test.baixing.cn'
      //domain = 'agui.shop-test.baixing.cn'

      /*后端在test分支，且店铺类型是是模板1，B2C模板，使用这个domain*/
      // domain = 'shop-test.baixing.cn'

      /*后端在dev分支，且店铺类型是是模板2，B2B模板，使用这个domain*/
      // domain = 'zmlc2b.shop.baixing.cn'
      // domain = 'agui.shop.baixing.cn'

      /*后端在dev分支，且店铺类型是是模板1，B2C模板，使用这个domain*/
      return 'shop.baixing.cn'

    }
    return domain
  }

  /**
   * 
   * @param uid 
   * @param device 
   * @param domain 
   * @param singleDomain 用户自定义的域名特殊标识
   * @returns 
   */
  private setPageHeaders(uid: string, device: string, domain: string, singleDomain: string): SemPageHeaderParams {
    return {
      'x-api-user': uid || '',
      'x-api-shop-name': '',
      'x-api-device': device || '',
      'x-api-domain': this.getDomain(domain) || '',
      'x-api-single-domain': singleDomain || ''
    }
  }

  private setGetUserInfoHeaders(cookies: any, domain: string): Partial<HeaderAuthParams> {
    return {
      'x-api-hash': (cookies && cookies[COOKIE_HASH_KEY]) || '',
      'x-api-user': (cookies && cookies[COOKIE_USER_KEY]) || '',
      'x-api-token': (cookies && cookies[COOKIE_TOKEN_KEY]) || '',
      'x-api-mask-user': (cookies && cookies[COOKIE_CHAOREN_USER_KEY] && cookies[COOKIE_CHAOREN_USER_KEY].replace(/u/ig,'').split('-')[0]) || '',
      'content-type': 'application/json;charset=UTF-8',
      'x-api-src': 'web'
    }
  }

  public getUserInfo(req: Request, domain: string): Promise<ServiceResponse<ShopComponents>> {
    return this.requestService.post(`${this.midwayPrefixPath}/user/getUserBaseInfo`, {},
      this.setGetUserInfoHeaders(req.cookies, domain));
  }

  public getHomePageData(uid: string, device: string, domain: string, singleDomain: string): Promise<ServiceResponse<ShopComponents>> {
    const uuid = this.getUid(uid)
    return this.requestService.post(`${this.prefixPath}/home/single`, {},
      this.setPageHeaders(uuid, device, domain, singleDomain));
  }

}
