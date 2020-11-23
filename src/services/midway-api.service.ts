import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { RequestService } from './request.service';

interface ManagementInput {
  method: string;
  path: string;
  params?: any;
}

@Injectable()
export class MidwayApiService {
  host: string;
  constructor(
    private readonly requestService: RequestService,
    private readonly configService: ConfigService) {
    this.host = configService.get('services.midway-service.host');
  }

  public getManagementData(input: ManagementInput): Promise<AxiosResponse<any>> {
    const {  path, params } = input
    const method = input.method.toLocaleLowerCase()
    switch (method) {
      case 'get':
        return this.requestService.get(`${this.host}${path}`, { params });
        break;
      case 'post':
        return this.requestService.post(`${this.host}${path}`, { data: params });
        break;
      default:
        throw new HttpException('缺少method方法', HttpStatus.INTERNAL_SERVER_ERROR);
        break;
    }
  }

  public getHomeData(path: string, params?: any): Promise<any> {
    return this.requestService.get(`${this.host}${path}`, { params });
  }
}
