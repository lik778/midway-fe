import { Controller } from '@nestjs/common';
import { BaseSiteController } from './base-site.controller';
import { MidwayService } from '../../services/midway.service';
import config from '../../config'
import { DomainTypeEnum } from '../../enums';

@Controller({ host: config().hostType.fuwu, path: '/:shopName' })
export class FuwuSiteController extends BaseSiteController{
  constructor(protected readonly midwayApiService: MidwayService) {
    super(midwayApiService, DomainTypeEnum.FUWU)
  }
}
