import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TrackerType } from '../enums/tracker';
import { LogService } from './log.service';
import { apiSecret } from '../constant';

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

  public point(type: TrackerType, data: any): Promise<any> {
    return this.httpService.post(`${this.host}/api/midway/internal/event/tracking/report`,
      JSON.stringify({ type, data }), { headers: this.setTrackerHeaders() }).toPromise().catch(err => {
        this.logService.errorLog(err)
        throw new BadRequestException('打点错误');
      })
  }

  public trackerBasicData(req: Request) {
      return {};
  }
}
