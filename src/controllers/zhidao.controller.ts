import { Controller, Post, Get, Body, Req, Res } from '@nestjs/common';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { Request, Response } from 'express';
import { ZhidaoService } from '../services/zhidao.service';
import config from '../config';

@Controller({ host: config().hostType.base, path: '/zhidao' })
export class ZhidaoController {
  constructor(private zhidaoService: ZhidaoService) {}

  @Post('/api')
  async zhidaoApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const zhidaoData = await this.zhidaoService.getZhidaoData(req, body);
    res.json(zhidaoData)
  }
} 
