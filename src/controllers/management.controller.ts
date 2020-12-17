import { Controller, UseGuards, Post, Get, Body, Req, Res } from '@nestjs/common';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { Request, Response } from 'express';
import { MidwayService } from '../services/midway.service';
import { join } from 'path'


@Controller('/management')
export class ManagementController {
  constructor(private midwayApiService: MidwayService) {}
  @Get('*')
  managementView(@Req() req: Request, @Res() res: Response) {
    const goto = () => { res.sendFile(join(__dirname, '../../', '/dist/public/index.html')) }
    this.midwayApiService.canEnterManagement(req, res).then(res => goto()).catch(e => {
      const code = Number(e.response && e.response.data && e.response.data.code)
      this.midwayApiService.managementRedirectTo(code, res, goto)
    })
  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.midwayApiService.getManagementData(req, body);
    res.json(managementData)
  }
}
