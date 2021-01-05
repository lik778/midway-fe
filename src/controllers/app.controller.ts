import { BadRequestException, Controller, Get, HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import * as fs  from 'fs';
import config, { DEVELOPMENT_ENV, TEST_ENV } from '../config';
import { COOKIE_HASH_KEY, COOKIE_TOKEN_KEY, COOKIE_USER_KEY } from '../constant/cookie';

const staticFiles = join(__dirname , '..', '..', '/assets/static')
const files = fs.readdirSync(staticFiles);

@Controller({ host: config().hostType.fuwu, path: '/' })
export class AppController {
  @Get('/')
  home (@Req() req: Request, @Res() res: Response) {
    res.render('common/home')
  }

  @Get(files) // 处理静态资源
  haha (@Req() req: Request, @Res() res: Response) {
    const staticPath = join(staticFiles, req.path)
    if (fs.existsSync(staticPath)) {
      res.sendFile(staticPath)
    } else {
      throw new HttpException('没有存在的资源', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  @Get('/midway/health')
  async managementView(@Req() req: Request, @Res() res: Response) {
    res.send(process.env.NODE_ENV + ': everything is ok!!!')
  }

  @Get('/midway/set-cookie')
  async getCookies(@Req() req: Request, @Res() res: Response) {
    if ([DEVELOPMENT_ENV, TEST_ENV].includes(config().env)) {
      [COOKIE_TOKEN_KEY, COOKIE_HASH_KEY, COOKIE_USER_KEY].forEach((cookieKey: string) => {
        const cookieValue = req.cookies[cookieKey]
        if (cookieValue) {
          res.cookie(cookieKey, cookieValue, { httpOnly: true })
        }
      })
      res.json({ success: true, message: '操作成功', code: 200 })
    } else {
      throw new BadRequestException('不能进行cookie操作')
    }
  }

}
