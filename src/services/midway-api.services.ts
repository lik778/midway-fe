import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestService } from './request.services';


@Injectable()
export class MidwayApiService {
  host: string;
  constructor(
    private requestService: RequestService,
    private configService: ConfigService) {
    this.host = configService.get('services.midway-service.host');
  }

  public getHomeData(): void {
    console.log(this.host)
    console.log('获取文章数据')
  }
}
