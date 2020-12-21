import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Kf53Service } from '../services/kf53.service';
import { Kf53DTO } from '../dto/kf53.dto';

@Controller('/kf53/api')
export class Kf53Controller {
  constructor(private readonly kf53Service: Kf53Service) {
  }

  @Get('/edit')
  async editInfo(@Query() query: Kf53DTO, @Req() req: Request, @Res() res: Response) {
    const resData = await this.kf53Service.editInfo(req, query)
    res.json(resData);
  }

  @Get('/script')
  async getScript(@Req() req: Request, @Res() res: Response) {
    const resData = await this.kf53Service.getInfo(req)
    res.send(resData);
  }
}
