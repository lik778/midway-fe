import { Controller, Get, Req, Res, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserAgent } from '../decorator/user-agent.decorator';
import { SemApiService } from '../services/sem.service';
import { TrackerService } from '../services/tracker.service';
import { TrackerType } from '../enums/tracker';
import config from '../config';
import { COOKIE_HASH_KEY, COOKIE_TOKEN_KEY, COOKIE_USER_KEY } from '../constant/cookie';

@Controller({ host: config().hostType.base })
export class SemController {
  constructor(private SemApiService: SemApiService, private trackerService: TrackerService) { }

  @Get('/sem/:uid')
  public async home(@Param() params, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    let uid = params.uid
    const domain = req.hostname
    const cookies = req.cookies
    let userInfo = null
    if (cookies && cookies[COOKIE_HASH_KEY] && cookies[COOKIE_USER_KEY] && cookies[COOKIE_TOKEN_KEY]) {
      try {
        const { data } = await this.SemApiService.getUserInfo(req, domain);
        userInfo = data
      } catch (e) {
        console.log(e)
      }
    }
    const response = await this.SemApiService.getHomePageData(uid, device, domain);
    if (response.code === 404) {
      return res.render('common/404', { title: '页面找不到', haojingHost: config().haojing });
    }
    const { data } = response
    // 打点
    let shopId = ''
    let shopName = ''
    // 有可能没有shop字段 ，是微店用户
    if (data.basic.shop) {
      shopId = data.basic.shop.id
      shopName = data.basic.shop.name
    }
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
    const templateUrl = `sem/pc/home/index`
    const currentPathname = req.originalUrl;
    return res.render(templateUrl, { title: '首页', renderData: { ...data, uid, currentPathname, shopId, shopName, userInfo }, isHome: true });
  }
}
