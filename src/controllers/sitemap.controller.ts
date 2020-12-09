import { Controller, Get, Req, Res, Param, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';
import { SitemapService } from '../services/sitemap.service';

@Controller('/sitemap')
export class SitemapController {
  constructor(private sitemapService: SitemapService) {
  }
  @Get('/increment_:date.xml')
  async sitemap(@Param() params, @Req() req: Request, @Res() res: Response) {
    const { date } = params;
    res.send(this.sitemapService.getSitemapByDate(date))
  }
}
