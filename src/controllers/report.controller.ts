import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { ReportService } from '../services/report.service';
import config from '../config';

@Controller({ host: config().hostType.fuwu, path: '/report' })
export class ReportController {
  constructor(private reportService: ReportService) {}
  // 报表分享
  @Get('/overview')
  overviewReport(@Req() req: Request, @Res() res: Response) {
    res.render('report', { url: `//${config().hostType.fuwu}/management/report/cate-flow` });
  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.reportService.getReportData(req, body);
    res.json(managementData)
  }
}
