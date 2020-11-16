import { Controller, Get, Render } from '@nestjs/common';
import { MidwayApiService } from '../services/midway-api.services';

@Controller('/site')
export class SiteController {
  constructor(private midwayApiService: MidwayApiService) {}

  @Get('/home')
  @Render('site-template-1/pc/home/index')
  async home() {
    // 获取java层数据数据
    const tips = await this.midwayApiService.getHomeData('/api/midway/health/');
    return { title: '首页', tips }
  }

  @Get('/news')
  @Render('site-template-1/pc/news')
  listing() {
    return { title: '新闻资讯' }
  }

  @Get('/product')
  @Render('site-template-1/pc/product/index')
  about() {
    return { title: '产品服务' }
  }

}
