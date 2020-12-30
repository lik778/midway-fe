import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';
import { LogService } from './log.service';
import { apiSecret } from '../constant';
import { TrackerDTO } from '../dto/tracker.dto';

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
    return this.httpService.post(`${this.host}/api/midway/internal/event/tracking/report`,
      JSON.stringify({ eventType, data: Object.assign(data, this.trackerBasicData(req, res)) }), { headers: this.setTrackerHeaders() }).toPromise().catch(err => {
        this.logService.errorLog(err)
        throw new BadRequestException('打点错误');
      })
  }

  //pv,event公共的打点
  public trackerBasicData(req: Request, res: Response): any {
      return {
        _trackId: this.getTrackId(req, res),
        url: req.protocol + '://' + req.get('host') + req.originalUrl,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        ua: req.headers['user-agent']
      };
  }

  public getTrackId(req: Request, res: Response) {
    const trackId = req.cookies && req.cookies.__trackId;
    if (!trackId || !/^[0-9]{15}$/.test(trackId)) {
      const gTrackId = this.generateTrackId();
      res.cookie(this.TRACKID, gTrackId, {
        maxAge: 86400 * 365 * 2,
        httpOnly: true,
        domain: this.haojingDomain
      });
      return  gTrackId
    }
    return trackId
  }

  public generateTrackId() {
    return dayjs(new Date()).unix().toString() + Math.floor(10000 + Math.random() * 90000).toString();
  }

}
