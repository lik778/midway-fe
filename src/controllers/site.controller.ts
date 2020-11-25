import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { UserAgent } from '../decorator';
import { MidwayService } from '../services/midway.service';
import { Request, Response } from 'express';

@Controller('/:shopName')
export class SiteController {
  constructor(private midwayApiService: MidwayService) {}

  @Get('/')
  public async home(@Param() params, @Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
      const shopName = this.midwayApiService.getShopName(params.shopName)
      const device = isWap ? 'wap' : 'pc'
      const templateUrl = `site-template-1/${device}/home/index`
      const { data } = await this.midwayApiService.getHomeData(shopName, device);
      return res.render(templateUrl, { title: '首页', renderData: { ...data, shopName }, isHome: true });
  }

  @Get('/n')
  async listing(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/news/index`
    return res.render(templateUrl, { title: '新闻资讯' });
  }

  @Get('/n-:id')
  async newschild(@Param() params, @Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    if (/.html$/.test(req.url)) {
      const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/news-detail/index`
      return res.render(templateUrl, { title: '资讯详情' });
    } else {
      const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/news-child/index`
      return res.render(templateUrl, { title: '资讯子类' });
    }
  }

  @Get('/p')
  async product(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/product/index`
    return res.render(templateUrl, { title: '产品服务' });
  }

  @Get('/p-:id')
  async productchild(@Param() params, @Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    if (/.html$/.test(req.url)) {
      const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/product-detail/index`
      return res.render(templateUrl, { title: '产品详情页' });
    } else {
      const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/product-child/index`
      return res.render(templateUrl, { title: '服务子类' });
    }
  }
}
