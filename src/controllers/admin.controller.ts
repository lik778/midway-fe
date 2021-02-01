import { Controller, Get, Req, Res } from '@nestjs/common';
import config from '../config';
import { Request, Response } from 'express';

@Controller({ host: config().hostType.fuwu, path: '/midway-admin' })
export class AdminController {
  @Get('*')
  managementView(@Req() req: Request, @Res() res: Response) {
    res.render('midway-admin/index')
  }
}
