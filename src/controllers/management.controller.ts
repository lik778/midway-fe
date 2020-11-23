import { Controller, UseGuards, Post, Get, Body, Req, Res } from '@nestjs/common';
import { ApiQeqDTO } from '../dto/api-req.dto';
import  { VipUserGuard } from '../guards/vip-user.guard'
import { Request, Response } from 'express';
import { MidwayApiService } from '../services/midway-api.service';


@Controller('/management')
export class ManagementController {
  constructor(private midwayApiService: MidwayApiService) {}
  @Get('/')
  @UseGuards(VipUserGuard)
  async managementView(@Req() req: Request, @Res() res: Response) {
    res.send('view enter')
  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.midwayApiService.getManagementData(body, req.cookies);
    res.json(managementData)
  }
}
