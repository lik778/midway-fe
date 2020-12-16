import { Controller, UseGuards, Post, Get, Body, Req, Res } from '@nestjs/common';
import { ApiQeqDTO } from '../dto/api-req.dto';
import  { VipUserGuard } from '../guards/vip-user.guard'
import { Request, Response } from 'express';
import { MidwayService } from '../services/midway.service';
import { join } from 'path'


@Controller('/management')
export class ManagementController {
  constructor(private midwayApiService: MidwayService) {}
  @Get('*')
  async managementView(@Req() req: Request, @Res() res: Response) {
    const canEnter = await this.midwayApiService.canEnterManagement(req, res)
    if (Boolean(canEnter)) {
      res.sendFile(join(__dirname, '../../', '/dist/public/index.html'))
    }

  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.midwayApiService.getManagementData(req, body);
    res.json(managementData)
  }
}
