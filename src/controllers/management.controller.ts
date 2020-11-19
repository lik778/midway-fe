import { Controller, UseGuards, Post, Get, Body, Req, Res } from '@nestjs/common';
import { ApiQeqDTO } from '../dto/api-req.dto';
import  { VipUserGuard } from '../guards/vip-user.guard'
import { Request, Response } from 'express';


@Controller('/management')
export class ManagementController {

  @Get('/')
  @UseGuards(VipUserGuard)
  async managementView(@Req() req: Request, @Res() res: Response) {
    res.send('view enter')
  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    res.json({ name: 'api' })
  }
}
