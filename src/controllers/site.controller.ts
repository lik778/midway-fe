import { Controller, Get, Req, Res, Render } from '@nestjs/common';
import { UserAgent } from '../decorator';
import { MidwayApiService } from '../services/midway-api.services';
import { Request, Response } from 'express';

@Controller('/site')
export class SiteController {
  constructor(private midwayApiService: MidwayApiService) {}

  @Get('/home')
  async home(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
      const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/home/index`
      // 获取java层数据数据
      const tips = await this.midwayApiService.getHomeData('/api/midway/health/');
      return res.render(templateUrl, { title: '首页', tips });
  }

  @Get('/news')
  @Render('site-template-1/pc/news/index')
  listing() {
    return { title: '新闻资讯' }
  }

  @Get('/product')
  @Render('site-template-1/pc/product/index')
  product() {
    return { title: '产品服务' }
  }

}
