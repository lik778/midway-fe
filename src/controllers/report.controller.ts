import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { ReportService } from '../services/report.service';

@Controller('/report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('/overview-report')
  overviewReport(@Req() req: Request, @Res() res: Response) {
    res.send('这里是报表外部预览入口');
  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.reportService.getReportData(req, body);
    res.json(managementData)
  }
}
