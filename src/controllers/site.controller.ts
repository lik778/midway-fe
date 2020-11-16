import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SiteController {
  @Get('/site')
  @Render('site-template-1/pc/home/index')
  home() {
    return { title: '首页官网' }
  }

  @Get('/site/news')
  @Render('site-template-1/pc/news/index')
  listing() {
    return { title: '新闻资讯' }
  }

  @Get('/site/product')
  @Render('site-template-1/pc/product/index')
  about() {
    return { title: '产品服务' }
  }

}
