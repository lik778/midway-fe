import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { TrackerService } from '../services/tracker.service';
import { TrackerDTO } from '../dto/tracker.dto';

@Controller('/tracker')
export class TrackerController {
  host: string;
  constructor(private trackerService: TrackerService) {}

  @Post('/')
  async tracker(@Req() req: Request, @Res() res: Response, @Body() body: TrackerDTO) {
    const resData = await this.trackerService.point(req, res, body)
    res.send(resData.data)
  }
}
