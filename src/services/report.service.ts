import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestService } from './request.service';
import { LogService } from './log.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ApiReqParams } from '../interface';
import { AxiosResponse } from 'axios';
import { COOKIE_USER_KEY } from '../constant/cookie';

@Injectable()
export class ReportService {
  report_base = '/api/reporting-service'
  host: string;
  haojingHost: string;
  constructor(
    private readonly requestService: RequestService,
    private readonly logService: LogService,
    private readonly configService: ConfigService) {
    this.host = configService.get('services.reporting-service.host');
  }

  private setHeader(): any {
    return {
      "Content-Type": "application/json;charset=utf-8"
    }
  }

  public getReportData(req: Request, input: ApiReqParams): Promise<AxiosResponse<any>> {
    let {  params } = input
    const { path } = input
    // tips: 在系统中userID数据的获取
    const mixObj = { userId: (req.cookies && req.cookies[COOKIE_USER_KEY]) };
    // const mixObj = { userId: 237463934 }
    params = params == null ? mixObj : Object.assign(params, mixObj)
    const method = input.method.toLocaleLowerCase()
    switch (method) {
      case 'get':
        return this.requestService.get(`${this.host}${this.report_base}${path}`, params, this.setHeader());
      case 'post':
        return this.requestService.post(`${this.host}${this.report_base}${path}`, params, this.setHeader());
      default:
        throw new HttpException('缺少method方法', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
