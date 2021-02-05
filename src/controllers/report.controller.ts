import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { ManagementService } from '../services/management.service';

@Controller('/report')
export class ReportController {
  constructor(private managementService: ManagementService) {}
  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.managementService.getManagementData(req, body);
    res.json(managementData)
  }
}
