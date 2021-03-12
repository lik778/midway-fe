import { Controller } from '@nestjs/common';
import { BaseSiteController } from './base-site.controller';
import { SiteService } from '../../services/site.service';
import config from '../../config'
import { DomainTypeEnum } from '../../enums';
import { TrackerService } from '../../services/tracker.service';

@Controller({ host: config().hostType.base, path: '/:shopName' })
export class FuwuSiteController extends BaseSiteController{
  constructor(protected readonly midwayApiService: SiteService,
              protected readonly trackerService: TrackerService) {
    super(midwayApiService, trackerService, DomainTypeEnum.FUWU)
  }
}
