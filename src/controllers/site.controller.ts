import { Controller, Get, Render } from '@nestjs/common';
import { MidwayApiService } from '../services/midway-api.services';

@Controller('/site')
export class SiteController {
  constructor(private midwayApiService: MidwayApiService) {}

  @Get('/')
  @Render('site-template-1/pc/home/index')
  home() {
    this.midwayApiService.getHomeData();
    return { title: '首页' }
  }

  @Get('/listing')
  @Render('site-template-1/pc/listing')
  listing() {
    return { title: '列表页' }
  }

  @Get('/about')
  @Render('site-template-1/pc/about')
  about() {
    return { title: '关于我们' }
  }

}
