import { BadRequestException, HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { LogService } from './log.service';
import { apiSecret } from '../constant'
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
    if (dayjs(date).format('YYYYMMDD') === date) {
      return this.httpService.get(`${this.host}/api/midway/internal/sitemap/increment_${date}.xml`, {
        headers: this.setSitemampHeaders()
      }).toPromise().catch(err => {
        this.logService.errorLog(err)
        throw new BadRequestException('请求sitemap错误');
      })
    } else {
      throw new HttpException('sitemap时间戳错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getSitemapByShopName(shopId: number): Promise<any> {
      return this.httpService.get(`${this.host}/api/midway/internal/sitemap/shop_${shopId}.xml`, {
        headers: this.setSitemampHeaders()
      }).toPromise().catch(err => {
        this.logService.errorLog(err)
        throw new BadRequestException('请求单店铺sitemap错误');
      })
  }

}
