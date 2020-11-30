import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { HaojingService } from '../services/haojing.service';

// tips: 虽然想不再和haojing打交道，但是这边还是需要
@Controller('/haojing')
export class HaojingController {
  constructor(private readonly haojingService: HaojingService) {
  }

  @Get('/upyunImgConfig')
  async managementView(@Res() res: Response) {
    const config = await this.haojingService.getUpyunImgConfig();
    res.json(config);
  }
}
