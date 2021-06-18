import { Controller, UseGuards } from '@nestjs/common';
import { BaseSiteController } from './base-site.controller';
import { SiteService } from '../../services/site.service';
import config from '../../config'
import { DomainTypeEnum } from '../../enums';
import { TrackerService } from '../../services/tracker.service';
import { UserGuard } from 'src/util/httpInterceptors';

//继承自base-site.controller,用于b2b路由
@Controller({ host: config().hostType.prefix })
@UseGuards(UserGuard)
export class B2bSiteController extends BaseSiteController {
  constructor(protected readonly midwayApiService: SiteService,
             protected readonly trackerService: TrackerService) {
   super(midwayApiService, trackerService, DomainTypeEnum.B2B)
  }
}
