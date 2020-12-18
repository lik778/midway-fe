import { Controller } from '@nestjs/common';
import { BaseSiteController } from './base-site.controller';
import { MidwayService } from '../../services/midway.service';
import config from '../../config'
import { DomainTypeEnum } from '../../enums';
import { TrackerService } from '../../services/tracker.service';

@Controller({ host: config().hostType.b2b })
export class B2bSiteController extends BaseSiteController {
  constructor(protected readonly midwayApiService: MidwayService,
              protected readonly trackerService: TrackerService) {
    super(midwayApiService, trackerService, DomainTypeEnum.B2B)
  }
}
