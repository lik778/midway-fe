import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class TemplateController {
  @Get('/template')
  @Render('templates/temp1/pc/index')
  template() {
    return { message: '测试信息' }
  }
}
