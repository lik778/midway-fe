import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { LogService } from './log.service';
import { apiSecret } from '../constant'
import { ApiException } from '../exceptions/api.exception';
@Injectable()
export class SitemapService {
  host: string;
  constructor(private readonly configService: ConfigService,
    private readonly logService: LogService,
    private readonly httpService: HttpService) {
    this.host = configService.get('services.midway-service.host');
  }

  setSitemampHeaders(): any {
    return {
      'content-type': 'application/x-www-form-urlencoded',
      'x-api-secret': apiSecret
    }
  }

  getSitemapByDate(date: string): Promise<any> {
    const url = `${this.host}/api/midway/internal/sitemap/increment_${date}.xml`
    if (dayjs(date).format('YYYYMMDD') === date) {
      return this.httpService.get(url, {
        headers: this.setSitemampHeaders()
      }).toPromise().catch(err => {
        this.logService.errorLog(err)
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, '请求sitemap错误', 'sitemap.service getSitemapByDate ApiException 1', JSON.stringify({ url }));
      })
    } else {
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, 'sitemap时间戳错误', 'sitemap.service getSitemapByDate ApiException 2', JSON.stringify({ url }));
    }
  }

  getSitemapByShopName(shopId: number): Promise<any> {
    const url = `${this.host}/api/midway/internal/sitemap/shop_${shopId}.xml`
    return this.httpService.get(url, {
      headers: this.setSitemampHeaders()
    }).toPromise().catch(err => {
      this.logService.errorLog(err);
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, '请求单店铺sitemap错误', 'sitemap.service getSitemapByShopName ApiException 1', JSON.stringify({ url }));
    })
  }

}
