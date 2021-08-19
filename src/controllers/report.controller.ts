import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { ReportService } from '../services/report.service';
import { UserAgent } from '../decorator/user-agent.decorator';
import config from '../config';
import { PageException } from '../exceptions/page.exception';
import { COOKIE_HASH_KEY, COOKIE_TOKEN_KEY, COOKIE_USER_KEY } from '../constant/cookie';

const isLocal = process.env.NODE_ENV === 'local'

@Controller({ host: config().hostType.base, path: '/report' })
export class ReportController {
  constructor(private reportService: ReportService) {}

  // 留咨页面分享（专供微信公众号-留咨中心入口使用）
  @Get('/message-share')
  messageReport(@Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const cookies = req.cookies
    if (cookies && cookies[COOKIE_HASH_KEY] && cookies[COOKIE_USER_KEY] && cookies[COOKIE_TOKEN_KEY]) {
      res.render('report/share', {
        title: '留咨列表',
        url: isLocal
          ? '//localhost/management/report/message?mobile=1&from=wechat'
          : `/management/report/message?mobile=${device!=='pc'?1:0}&from=wechat`
      })
    } else {
      res.redirect('https://www.baixing.com/oz/login?redirect=https%3A%2F%2Fshop.baixing.com%2Freport%2Fmessage-share%3Ffrom%3Dmsvip')
    }
  }

  // 报表分享 
  @Get('/keyword')
  overviewReport(@Req() req: Request, @Res() res: Response, @Query() query) {
    if (!query.userId) {
      throw new PageException(HttpStatus.INTERNAL_SERVER_ERROR, false, '无效的用户');
    }
    // url做了兼容
    res.render('report/share', { title: '数据总览',
      url: `//${ config().hostType.base || 'localhost:1024' }/management/report/keyword?userId=${query.userId}` });
  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.reportService.getReportData(req, body);
    res.json(managementData)
  }
}
