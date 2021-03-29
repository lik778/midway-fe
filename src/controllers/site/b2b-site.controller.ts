import { Controller, Get, HostParam, HttpException, HttpStatus, Param, Query, Req, Res } from '@nestjs/common';
import { BaseSiteController } from './base-site.controller';
import { SiteService } from '../../services/site.service';
import config from '../../config'
import { DomainTypeEnum } from '../../enums';
import { TrackerService } from '../../services/tracker.service';
import { Request, Response } from 'express';
import { UserAgent } from '../../decorator/user-agent.decorator';
import { TrackerType } from '../../enums/tracker';
import { DeviceType } from '../../enums/base';

@Controller({ host: config().hostType.prefix })
export class B2bSiteController extends BaseSiteController {
  constructor(protected readonly midwayApiService: SiteService,
              protected readonly trackerService: TrackerService) {
    super(midwayApiService, trackerService, DomainTypeEnum.B2B)
  }

  //关于我们(只有b2b模板pc有)
  @Get('/about')
  async about(@Param() params, @HostParam('shopName') HostShopName: string,
              @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    if (device === DeviceType.WAP) throw new HttpException('页面找不到', HttpStatus.NOT_FOUND)
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const { data } = await this.midwayApiService.getAboutPageData(shopName, device, domain);
    // 打点
    const shopId = data.basic.shop.id
    this.trackerService.point(req, res,{ eventType: TrackerType.BXMAINSITE, data: {
        event_type: TrackerType.BXMAINSITE,
        site_id: 'dianpu',
        shop_id: shopId,
        pageType: 'view_listing',
        contentType: 'article',
        category: '',
        _platform: device,
        tracktype: 'pageview',
        refer: ''
      }
    })
    const templateUrl = `site-template-2/${device}/about/index`;
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)
    return res.render(templateUrl, { title: '关于我们', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId } });
  }
}
