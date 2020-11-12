import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SiteController {
  @Get('/site')
  @Render('site-template-1/pc/home')
  home() {
    return { message: '测试信息' }
  }

  @Get('/site/listing')
  @Render('site-template-1/pc/listing')
  listing() {
    return null;
  }

  @Get('/site/about')
  @Render('site-template-1/pc/about')
  about() {
    return null;
  }

}
