import { Controller, Get, Req, Res, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserAgent } from '../decorator/user-agent.decorator';
import { SemApiService } from '../services/sem.service';
import { TrackerService } from '../services/tracker.service';
import { TrackerType } from '../enums/tracker';
import config from '../config';

@Controller({ host: config().hostType.base })
export class SemController {
  constructor(private SemApiService: SemApiService, private trackerService: TrackerService) { }

  @Get('/sem/:uid')
  public async home(@Param() params, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    let uid = params.uid
    const domain = req.hostname
    const { data } = await this.SemApiService.getHomePageData(uid, device, domain);
    // 打点
    const shopId = data.basic.shop.id
    // this.trackerService.point(req, res, {
    //   eventType: TrackerType.BXMAINSITE, data: {
    //     event_type: TrackerType.BXMAINSITE,
    //     site_id: 'sem',
    //     shop_id: shopId,
    //     pageType: 'view_home',
    //     _platform: device,
    //     tracktype: 'pageview',
    //   }
    // })

    //按约定，根据后端返回的模板id来选择跳转到哪个前端模板
    const templateUrl = `sem/pc/home/index`
    const currentPathname = req.originalUrl;
    const trackId = this.trackerService.getTrackId(req, res)
    return res.render(templateUrl, { title: '首页', renderData: { ...data, uid, currentPathname, shopId, trackId }, isHome: true });
  }
}
