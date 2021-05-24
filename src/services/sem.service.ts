import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestService } from './request.service';
import { PageHeaderParams, ServiceResponse, ShopComponents } from '../interface';
import { LogService } from './log.service';

@Injectable()
export class SemApiService {
  private prefixPath: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly requestService: RequestService,
    private readonly logService: LogService,
    private readonly configService: ConfigService) {
    const host = configService.get('services.midway-service.host');
    // TODO;
    this.prefixPath = `${host}/api/midway/frontend`
  }


  public getUid(uid: string): string {
    if (uid) {
      return uid;
    } else {
      throw new HttpException('店铺不存在', HttpStatus.NOT_FOUND)
    }
  }

  private setPageHeaders(shopName: string, device: string, domain: string): PageHeaderParams {
    /**切换domain.根据后端分支和模板类型选择 */

    if (domain === 'localhost' || domain === 'dianpu.baixing.cn' || domain.indexOf('172.17') !== -1) {
      /*后端在test分支，且店铺类型是是模板2，B2B模板，使用这个domain*/
      // domain = 'hongxiny.shop-test.baixing.cn'
      //domain = 'agui.shop-test.baixing.cn'

      /*后端在test分支，且店铺类型是是模板1，B2C模板，使用这个domain*/
      domain = 'shop-test.baixing.cn'

      /*后端在dev分支，且店铺类型是是模板2，B2B模板，使用这个domain*/
      // domain = 'zmlc2b.shop.baixing.cn'
      // domain = 'agui.shop.baixing.cn'

      /*后端在dev分支，且店铺类型是是模板1，B2C模板，使用这个domain*/
      // domain = 'shop.baixing.cn'

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

}
