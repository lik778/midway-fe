import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

@Injectable()
export class SitemapService {
  host: string;
  constructor(private readonly configService: ConfigService,
              private readonly httpService: HttpService) {
    this.host = configService.get('services.midway-service.host');
  }

  setSitemampHeaders(): any {
    return {
      'content-type': 'application/x-www-form-urlencoded',
      'x-api-secret': '674018ec0efcc4dce79759cdf03777df'
    }
  }
  getSitemapByDate(date: string): string {
    if (dayjs(date).format('YYYYMMDD') === date) {
      // 这边还要继续写
      this.httpService.get(`${this.host}/api/midway/internal/sitemap/shop_${date}.xml`, {
        headers: this.setSitemampHeaders()
      }).toPromise().then(res => { console.log(res) }).catch(err =>  console.log(err))
      return date;
    } else {
      throw new HttpException('sitemap时间戳错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
