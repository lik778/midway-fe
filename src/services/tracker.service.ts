import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { LogService } from './log.service';
import { apiSecret } from '../constant';
import { TrackerDTO } from '../dto/tracker.dto';

@Injectable()
export class TrackerService {
  host: string;
  constructor(private readonly configService: ConfigService,
              private readonly logService: LogService,
              private readonly httpService: HttpService) {
    this.host = configService.get('services.midway-service.host');
  }

  setTrackerHeaders(): any {
    return {
      'content-type': 'application/json',
      'x-api-secret': apiSecret
    }
  }

  public point(req: Request, body: TrackerDTO): Promise<any> {
    const { eventType, data } = body
    return this.httpService.post(`${this.host}/api/midway/internal/event/tracking/report`,
      JSON.stringify({ eventType, data: Object.assign(data, this.trackerBasicData(req)) }), { headers: this.setTrackerHeaders() }).toPromise().catch(err => {
        this.logService.errorLog(err)
        throw new BadRequestException('打点错误');
      })
  }

  //pv,event公共的打点
  public trackerBasicData(req: Request): any {
      return {
        _trackId: (req.cookies && req.cookies.__trackId) || null,
        url: req.protocol + '://' + req.get('host') + req.originalUrl,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        ua: req.headers['user-agent']
      };
  }
}
