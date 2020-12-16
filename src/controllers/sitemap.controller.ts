import { Controller, Get, Req, Res, Param, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';
import { SitemapService } from '../services/sitemap.service';

@Controller('/sitemap')
export class SitemapController {
  constructor(private sitemapService: SitemapService) {}

  @Get('/increment_:date.xml')
  async incrementSitemap(@Param() params, @Req() req: Request, @Res() res: Response) {
    console.log('23')
    const { date } = params;
    const resData = await this.sitemapService.getSitemapByDate(date)
    res.setHeader('Content-Type', 'text/xml')
    res.send(resData.data)
  }

  @Get('/shop_:shopId.xml')
  async shopSitemap(@Param() params, @Req() req: Request, @Res() res: Response) {
    const { shopId } = params;
    const resData = await this.sitemapService.getSitemapByShopName(Number(shopId))
    res.setHeader('Content-Type', 'text/xml')
    res.send(resData.data)
  }
}
