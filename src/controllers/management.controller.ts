import { Controller, Post, Get, Body, Req, Res } from '@nestjs/common';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { Request, Response } from 'express';
import { join } from 'path'
import { ManagementService } from '../services/management.service';
import config from '../config';


@Controller({ host: config().hostType.fuwu, path: '/management' })
export class ManagementController {
  constructor(private managementService: ManagementService) {}
  @Get('*')
  managementView(@Req() req: Request, @Res() res: Response) {
    const goto = () => res.sendFile(join(__dirname, '../../', '/dist/public/index.html'))
    this.managementService.canEnterManagement(req, res).then(res => goto()).catch(e => {
      const code = Number(e.response && e.response.data && e.response.data.code)
      this.managementService.managementRedirectTo(code, res, goto)
    })
  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.managementService.getManagementData(req, body);
    res.json(managementData)
  }
}
