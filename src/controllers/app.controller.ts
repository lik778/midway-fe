import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/')
export class AppController {
  @Get('/service/health')
  async managementView(@Req() req: Request, @Res() res: Response) {
    res.send(process.env.NODE_ENV + ': everything is ok!!!')
  }
}
