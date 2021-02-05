import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestService } from './request.service';
import { LogService } from './log.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ManagementReqParams } from '../interface';
import { AxiosResponse } from 'axios';

@Injectable()
export class ReportService {
  host: string;
  haojingHost: string;
  constructor(
    private readonly requestService: RequestService,
    private readonly logService: LogService,
    private readonly configService: ConfigService) {
    this.host = configService.get('services.report-service.host');
  }

  public getReportData(req: Request, input: ManagementReqParams): Promise<AxiosResponse<any>> {
    const {  path, params } = input
    const method = input.method.toLocaleLowerCase()
    switch (method) {
      case 'get':
        return this.requestService.get(`${this.host}${path}`, params);
        break;
      case 'post':
        return this.requestService.post(`${this.host}${path}`, params);
        break;
      default:
        throw new HttpException('缺少method方法', HttpStatus.INTERNAL_SERVER_ERROR);
        break;
    }
  }
}
