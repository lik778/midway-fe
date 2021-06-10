import { Controller, Post, Res, Body } from "@nestjs/common";
import { Response } from 'express';
import { SiteService } from '../services/site.service';

@Controller({ path: '/api/shield' })
export class AnalyticsController {
    constructor(protected readonly midwayApiService: SiteService) {}
    //  滑块验证码接口node层转发
   @Post('/web/check')
   async check (@Body() body, @Res() res: Response) {
    const resData = await this.midwayApiService.shieldCheck(body)
    res.json(resData)
   }
 
   @Post('/web/get')
   async get (@Body() body,  @Res() res: Response) {
     console.log('body', body)
     const resData = await this.midwayApiService.shieldGet(body)
     res.json(resData)
   }
}