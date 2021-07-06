import { Controller, Post, Req, Res, Body, Param } from "@nestjs/common";
import { Request, Response } from 'express';
import { SiteService } from '../../services/site.service';
import { UserAgent } from '../../decorator/user-agent.decorator';
import { LeadsReqDTO } from '../../dto/leads-req.dto';

@Controller({ path: '/site-api' })
export class SiteCommonController {
    constructor(protected readonly midwayApiService: SiteService) { }
    //留咨接口node层转发
    @Post('/leads')
    public async leads(@Req() req: Request, @Param() params, @UserAgent('device') device,
        @Res() res: Response, @Body() body: LeadsReqDTO) {
        const domain = req.hostname 
        const { shopName, ...restParams } = body
        const resData = await this.midwayApiService.leaveLeads(shopName, device, restParams, domain)
        res.json(resData)
    }

    @Post('/getPhoneNumber400')
    public async getPhoneNumber400(@Req() req: Request, @UserAgent('device') device,
        @Res() res: Response, @Body() body) {
        const domain = req.hostname
        const { shopName } = body
        const resData = await this.midwayApiService.getPhone400Number(shopName, device, domain)
        res.json(resData)
    }
}