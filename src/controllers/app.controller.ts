import { Controller, Get, HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import * as fs  from 'fs';

const staticFiles = join(__dirname , '..', '..', '/assets/static')
const files = fs.readdirSync(staticFiles);

@Controller('/')
export class AppController {
  @Get(files) // 处理静态资源
  haha (@Req() req: Request, @Res() res: Response) {
    const staticPath = join(staticFiles, req.path)
    if (fs.existsSync(staticPath)) {
      res.sendFile(staticPath)
    } else {
      throw new HttpException('没有存在的资源', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  @Get('/health')
  async managementView(@Req() req: Request, @Res() res: Response) {
    res.send(process.env.NODE_ENV + ': everything is ok!!!')
  }
}
