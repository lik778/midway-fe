import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { UserAgent } from '../decorator';
import { MidwayApiService } from '../services/midway-api.service';
import { Request, Response } from 'express';

@Controller('/:name')
export class SiteController {
  constructor(private midwayApiService: MidwayApiService) {}

  @Get('/')
  async home(@Param() params, @Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
      const { name } = params
      const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/home/index`
      const { data } = await this.midwayApiService.getHomeData(name);
      return res.render(templateUrl, { title: '首页', renderData: data, isHome: true });
  }

  @Get('/news')
  async listing(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/news/index`
    return res.render(templateUrl, { title: '新闻资讯' });
  }

  @Get('/news/child')
  async newschild(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/news-child/index`
    return res.render(templateUrl, { title: '资讯子类' });
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

  @Get('/product/detail')
  async productdetail(@Req() req: Request, @Res() res: Response, @UserAgent('isWap') isWap) {
    const templateUrl = `site-template-1/${isWap ? 'wap' : 'pc'}/product-detail/index`
    return res.render(templateUrl, { title: '产品子类' });
  }

}
