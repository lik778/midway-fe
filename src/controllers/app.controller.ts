import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/')
export class AppController {
  @Get('/health')
  async managementView(@Req() req: Request, @Res() res: Response) {
    res.send('everything is ok!!!')
  }
}
