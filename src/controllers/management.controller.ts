import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { Request, Response } from 'express';


@Controller('/management')
export class ManagementController {

  @Post('/api')
  async getBackStageData(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    res.json({ name: 'wulei' })
  }
}
