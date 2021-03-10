import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { ReportService } from '../services/report.service';
import config from '../config';
import { PageException } from '../exceptions/page.exception';

@Controller({ host: config().hostType.fuwu, path: '/report' })
export class ReportController {
  constructor(private reportService: ReportService) {}
  // 报表分享
  @Get('/dashboard')
  overviewReport(@Req() req: Request, @Res() res: Response, @Query() query) {
    if (!query.userId) {
      throw new PageException(HttpStatus.INTERNAL_SERVER_ERROR, false, '无效的用户');
    }
    // url做了兼容
    res.render('report/share', { title: '数据总览',
      url: `//${ config().hostType.fuwu || 'localhost:1024' }/management/report/dashboard?userId=${query.userId}` });
  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.reportService.getReportData(req, body);
    res.json(managementData)
  }
}
