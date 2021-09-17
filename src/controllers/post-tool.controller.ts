import { Controller, Post, Get, Body, Req, Res } from '@nestjs/common';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { Request, Response } from 'express';
import { PostToolService } from '../services/post-tool.service';
import config from '../config';

@Controller({ host: config().hostType.base, path: '/post-tool' })
export class PostToolController {
  constructor(private postToolService: PostToolService) {}

  @Post('/api')
  async postToolApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const postToolData = await this.postToolService.getPostToolData(req, body);
    res.json(postToolData)
  }
} 
