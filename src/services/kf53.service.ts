import { BadRequestException, HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { LogService } from './log.service';
import { Kf53DTO } from '../dto/kf53.dto';

@Injectable()
export class Kf53Service {
  private host: string;
  constructor(private readonly configService: ConfigService,
              private readonly logService: LogService,
              private readonly httpService: HttpService) {
    this.host = configService.get('services.kf53-service.host');
  }

  private getUserId(req: Request): string {
    if (!req.cookies.__u) throw new HttpException( '请传入userId', HttpStatus.INTERNAL_SERVER_ERROR);
    return req.cookies.__u
  }

  private throwError(err: any) {
    this.logService.errorLog(err)
    throw new HttpException( '请求53客服报错', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  public getInfo(req: Request): Promise<any> {
    return this.httpService.get(`${this.host}/user/get`, { params: { userId: this.getUserId(req) } }).toPromise()
      .then(res => res.data).catch(err => this.throwError(err))
  }

  public editInfo(req: Request, params: Kf53DTO): Promise<any> {
    return this.httpService.post(`${this.host}/user/edit`,  { ...params, userId: this.getUserId(req) }).toPromise()
      .then(res => res.data).catch(err => this.throwError(err))
  }

}
