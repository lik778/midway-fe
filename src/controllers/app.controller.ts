import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { SiteService } from '../services/site.service';
import { Request, Response } from 'express';
import { join } from 'path';
import * as fs  from 'fs';
import config from '../config';

const staticFiles = join(__dirname , '..', '..', '/assets/static')
const files = fs.readdirSync(staticFiles);

@Controller({ host: config().hostType.base, path: '/' })
export class AppController {
  constructor(readonly midwayApiService: SiteService) {}
  @Get('/')
  async home (@Req() req: Request, @Res() res: Response) {
    res.redirect('//shop.baixing.com/vad/')
  }

   

  @Get(files) // 处理静态资源
  haha (@Req() req: Request, @Res() res: Response) {
    const staticPath = join(staticFiles, req.path)
    if (fs.existsSync(staticPath)) {
      res.sendFile(staticPath)
    } else {
      throw new HttpException('没有存在的资源', HttpStatus.NOT_FOUND)
    }
  }


  @Get('/midway/health')
  async managementView(@Req() req: Request, @Res() res: Response) {
    res.send(process.env.NODE_ENV + ': everything is ok!!!')
  }
}
