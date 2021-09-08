import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';
import { LogService } from './log.service';
import { apiSecret, midwayAdminAPISecret } from '../constant';
import { TrackerDTO } from '../dto/tracker.dto';
import { ApiException } from '../exceptions/api.exception';

@Injectable()
export class TrackerService {
  TRACKID = '__trackId'
  host: string;
  haojingDomain: string;
  constructor(private readonly configService: ConfigService,
    private readonly logService: LogService,
    private readonly httpService: HttpService) {
    this.host = configService.get('services.midway-service.host');
    this.haojingDomain = configService.get('haojingDomain');
  }

  setTrackerHeaders(): any {
    return {
      'content-type': 'application/json',
      'x-api-secret': apiSecret
    }
  }

  public point(req: Request, res: Response, body: TrackerDTO): Promise<any> {
    const { eventType, data } = body
    const url = `${this.host}/api/midway/internal/event/tracking/report`
    const requestData = JSON.stringify({ eventType, data: Object.assign(this.trackerBasicData(req, res), data) })
    return this.httpService.post(url,
      requestData, { headers: this.setTrackerHeaders() }).toPromise().catch(err => {
        this.logService.errorLog(err);
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, '打点错误', 'tracker.service point ApiException 1', {
          url, data: requestData,
        });
      })
  }

  //pv,event公共的打点
  public trackerBasicData(req: Request, res: Response): any {
    const refer = req.headers.referer
    const referKey = refer ? refer.split('/')[2] : ''
    return {
      _trackId: this.getTrackId(req, res),
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      ua: req.headers['user-agent'],
      refer: refer || '',
      refer_keywords: referKey
    };
  }

  public getTrackId(req: Request, res: Response) {
    const trackId = req.cookies && req.cookies.__trackId;
    if (!trackId || !/^[0-9]{15}$/.test(trackId)) {
      const gTrackId = this.generateTrackId();
      res.cookie(this.TRACKID, gTrackId, {
        maxAge: 60 * 1000 * 60 * 24 * 365 * 2,
        httpOnly: true,
        domain: this.haojingDomain
      });
      return gTrackId
    }
    return trackId
  }

  public generateTrackId() {
    return dayjs(new Date()).unix().toString() + Math.floor(10000 + Math.random() * 90000).toString();
  }

  // FIXME

  setMediaImgHeaders(): any {
    return {
      'content-type': 'application/json',
      'x-api-secret': midwayAdminAPISecret
    }
  }

  public getAuditImgList(req: Request, res: Response, body: TrackerDTO): Promise<any> {
    const { eventType, data } = body
    const url = `${this.host}/api/midway/internal/mediaImg/imgReapply`
    const requestData = JSON.stringify({ eventType, data: Object.assign(this.trackerBasicData(req, res), data) })
    return this.httpService.post(url,
      requestData, { headers: this.setMediaImgHeaders() }).toPromise().catch(err => {
        this.logService.errorLog(err);
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, false, '获取审核记录错误', 'tracker.service getAuditImgList ApiException 1', { url, data: requestData });
      })
  }
}
