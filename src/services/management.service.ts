import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { RequestService } from './request.service';
import { LogService } from './log.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ErrorCode } from '../enums/error';
import { HeaderAuthParams, ApiReqParams } from '../interface';
import { COOKIE_HASH_KEY, COOKIE_TOKEN_KEY, COOKIE_USER_KEY, COOKIE_CHAOREN_USER_KEY } from '../constant/cookie';
import { midwayAdminAPISecret } from '../constant'
import { AxiosResponse } from 'axios';

@Injectable()
export class ManagementService {
  host: string;
  haojingHost: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly requestService: RequestService,
    private readonly logService: LogService,
    private readonly configService: ConfigService) {
    this.host = configService.get('services.midway-service.host');
    this.haojingHost = configService.get('haojing');
  }

  private setApiAHeaders(cookies: any, shopId?: string): Partial<HeaderAuthParams> {
    const headers = {
      'x-api-hash': (cookies && cookies[COOKIE_HASH_KEY]) || '',
      'x-api-user': (cookies && cookies[COOKIE_USER_KEY]) || '',
      'x-api-token': (cookies && cookies[COOKIE_TOKEN_KEY]) || '',
      'x-api-mask-user': (cookies && cookies[COOKIE_CHAOREN_USER_KEY] && cookies[COOKIE_CHAOREN_USER_KEY].replace(/u/ig,'').split('-')[0]) || '',
      'content-type': 'application/json;charset=UTF-8',
      'x-api-src': 'web'
    }
    if (shopId) {
      headers['x-api-shop-id'] = Number(shopId)
    }
    return headers;
  }

  public managementRedirectTo(code: number, res: Response, callback: any) {
    if (code === ErrorCode.ERR_AUTHENTICATION_ARGS) {
      res.redirect(`${this.haojingHost}/oz/login`)
      return
    } else if (code === ErrorCode.ERR_MANAGEMENT) {
      res.redirect(`${this.haojingHost}`)
      return
    } else {
      callback()
    }
  }

  public async canEnterManagement(req: Request, res: Response): Promise<any> {
    return this.httpService.post(`${this.host}/api/midway/backend/shop/init`, {},
      { headers: this.setApiAHeaders(req.cookies) }).toPromise()
  }

  public getManagementData(req: Request, input: ApiReqParams): Promise<AxiosResponse<any>> {
    const { path, params } = input
    const method = input.method.toLocaleLowerCase()
    const shopId: any = req.headers['shop-id']
    switch (method) {
      case 'get':
        return this.requestService.get(`${this.host}${path}`, params, this.setApiAHeaders(req.cookies, shopId));
      case 'post':
        return this.requestService.post(`${this.host}${path}`, params, this.setApiAHeaders(req.cookies, shopId));
      default:
        throw new HttpException('缺少method方法', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private setApiInternalHeaders(cookies: any): Partial<HeaderAuthParams> {
    return {
      'x-api-secret': midwayAdminAPISecret,
      'x-api-user': (cookies && cookies[COOKIE_USER_KEY]) || '',
      'content-type': 'application/json;charset=UTF-8',
    }
  }

  public requestInternal(req: Request, input: ApiReqParams): Promise<AxiosResponse<any>> {
    const { path, params } = input
    const method = input.method.toLocaleLowerCase()
    switch (method) {
      case 'get':
        return this.requestService.get(`${this.host}${path}`, params, this.setApiInternalHeaders(req.cookies))
      case 'post':
        return this.requestService.post(`${this.host}${path}`, params, this.setApiInternalHeaders(req.cookies))
      default:
        throw new HttpException('缺少method方法', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
