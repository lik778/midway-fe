import { Controller, Get, Req, Res } from '@nestjs/common';
import { UserAgent } from '../decorator';
import { MidwayApiService } from '../services/midway-api.services';
import { Request, Response } from 'express';

@Controller('/site')
export class SiteController {
  constructor(private midwayApiService: MidwayApiService) {}

  @Get('/home')
  async home(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
      const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/home/index`
      const tips = await this.midwayApiService.getHomeData('/api/midway/health/');
      return res.render(templateUrl, { title: '首页', tips, isHome: true });
  }

  @Get('/news')
  async listing(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/news/index`
    return res.render(templateUrl, { title: '新闻资讯' });
  }

  @Get('/news/detail')
  async newsdetail(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/news-detail/index`
    return res.render(templateUrl, { title: '资讯详情' });
  }

  @Get('/product')
  async product(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/product/index`
    return res.render(templateUrl, { title: '产品服务' });
  }

  @Get('/product/child')
  async productchild(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/product-child/index`
    return res.render(templateUrl, { title: '服务子类' });
  }

}
