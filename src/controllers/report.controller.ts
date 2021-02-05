import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { ReportService } from '../services/report.service';

@Controller('/report')
export class ReportController {
  constructor(private reportService: ReportService) {}
  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.reportService.getReportData(req, body);
    res.json(managementData)
  }
}
