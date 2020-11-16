import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SiteController {
  @Get('/site')
  @Render('site-template-1/pc/home/index')
  home() {
    return { message: '测试信息', title: '首页' }
  }

  @Get('/site/listing')
  @Render('site-template-1/pc/listing')
  listing() {
    return { title: '列表页' }
  }

  @Get('/site/about')
  @Render('site-template-1/pc/about')
  about() {
    return { title: '关于我们' }
  }

}
