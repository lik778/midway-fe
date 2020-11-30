import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestService } from './request.service';
import { ServiceResponse, ShopComponents } from '../interface';
import { UpyunImgConfig } from '../interface/haojing';

// tips: 这里面放着和haojing打交道的
@Injectable()
export class HaojingService {
  private haojingHost: string;
  constructor(private readonly configService: ConfigService,
              private readonly requestService: RequestService) {
    this.haojingHost = configService.get('haojing');
  }

  public getUpyunImgConfig(): Promise<ServiceResponse<UpyunImgConfig>> {
    return this.requestService.get(`${this.haojingHost}/a/upyun_img_config`, {})
  }
}
