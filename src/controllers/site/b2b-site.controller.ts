import { Controller } from '@nestjs/common';
import { BaseSiteController } from './base-site.controller';
import { MidwayService } from '../../services/midway.service';
import config from '../../config'
import { DomainTypeEnum } from '../../enums';

@Controller({ host: config().hostType.b2b })
export class B2bSiteController extends BaseSiteController {
  constructor(protected readonly midwayApiService: MidwayService) {
    super(midwayApiService, DomainTypeEnum.B2B)
  }
}
