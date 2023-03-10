import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { RequestService } from './request.service';
import { LogService } from './log.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ErrorCode } from '../enums/error';
import { HeaderAuthParams, ApiReqParams } from '../interface';
import { COOKIE_HASH_KEY, COOKIE_TOKEN_KEY, COOKIE_USER_KEY, COOKIE_CHAOREN_USER_KEY } from '../constant/cookie';
import { ServiceResponse } from '../interface/index'


@Injectable()
export class PostToolService {
  host: string;
  haojingHost: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly requestService: RequestService,
    private readonly logService: LogService,
    private readonly configService: ConfigService) {
    this.host = configService.get('services.post-tool-service.host');
    this.haojingHost = configService.get('haojing');
  }

  private setApiAHeaders(cookies: any, shopId?: string): Partial<HeaderAuthParams> {
    const headers = {
      'x-api-hash': (cookies && cookies[COOKIE_HASH_KEY]) || '',
      'x-api-user': (cookies && cookies[COOKIE_USER_KEY]) || '',
      'x-api-token': (cookies && cookies[COOKIE_TOKEN_KEY]) || '',
      'x-api-mask-user': (cookies && cookies[COOKIE_CHAOREN_USER_KEY] && cookies[COOKIE_CHAOREN_USER_KEY].replace(/u/ig, '').split('-')[0]) || '',
      'content-type': 'application/json;charset=UTF-8',
      'x-api-src': 'web',
      'BX-UID': (cookies && cookies[COOKIE_USER_KEY]) || '',
      'APP-ID': 0
    }
    if (shopId) {
      headers['x-api-shop-id'] = Number(shopId)
    }
    return headers;
  }

  private setDataFormat(res: any) {
    const { data, message, code } = res
    return {
      data,
      message,
      success: res.code === 0,
    }
  }

  public postToolRedirectTo(code: number, res: Response, callback: any) {
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

  public async canEnterPostTool(req: Request, res: Response): Promise<any> {
    return this.httpService.post(`${this.host}/api/midway/backend/shop/init`, {},
      { headers: this.setApiAHeaders(req.cookies) }).toPromise()
  }

  public async getPostToolData(req: Request, input: ApiReqParams): Promise<Pick<ServiceResponse<any>, 'success' | 'data' | 'message'>> {
    const { path, params } = input
    const method = input.method.toLocaleLowerCase()
    const shopId: any = req.headers['shop-id']
    let res
    switch (method) {
      case 'get':
        res = await this.requestService.get(`${this.host}${path}`, params, this.setApiAHeaders(req.cookies, shopId));
        break;
      case 'post':
        res = await this.requestService.post(`${this.host}${path}`, params, this.setApiAHeaders(req.cookies, shopId));
        break;
      case 'put':
        res = await this.requestService.put(`${this.host}${path}`, params, this.setApiAHeaders(req.cookies, shopId));
        break;
      case 'delete':
        res = await this.requestService.delete(`${this.host}${path}`, params, this.setApiAHeaders(req.cookies, shopId));
        break;
      default:
        throw new HttpException('??????method??????', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this.setDataFormat(res)
  }

}
