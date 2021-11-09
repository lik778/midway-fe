import { Controller, Post, Get, Body, Req, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQeqDTO } from '../dto/api-req.dto';
import { Request, Response } from 'express';
import { join } from 'path'
import { ManagementService } from '../services/management.service';
import config from '../config';
import * as fs from 'fs'

@Controller({ host: config().hostType.base, path: '/management' })
export class ManagementController {
  constructor(private managementService: ManagementService) {}

  @Get('*')
  managementView(@Req() req: Request, @Res() res: Response) {
    // const goto = () => res.sendFile(join(__dirname, '../../', '/dist/public/index.html'))
    // this.managementService.canEnterManagement(req, res).then(res => goto()).catch(e => {
    //   const code = Number(e.response && e.response.data && e.response.data.code)
    //   this.managementService.managementRedirectTo(code, res, goto)
    // })
    res.sendFile(join(__dirname, '../../', '/dist/public/index.html'))
  }

  @Post('/api')
  async managementApi(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.managementService.getManagementData(req, body);
    res.json(managementData)
  }

  // 上传文件
  @Post('/api/file')
  @UseInterceptors(FileInterceptor('file'))
  async managementFileApi(@UploadedFile() file, @Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    const managementData = await this.managementService.getManagementFileData(req, body, file);
    res.json(managementData)
  }
  
  // 从node下载模板文件
  @Post('/api/download-template')
  async managementDownloadTemplateApi(@Res() res: Response, @Body() body: any) {
    const { params } = body
    const filename = {
      KNOWLEDGE: 'jiadianweixiu空调维修.xlsx',
      SHOP_ARTICLE: '文章模板.xlsx',
      QUESTION_D: '问答回答模板.xlsx',
      QUESTION_ANSWER: '问答D词模板.xlsx'
    }[params]
    const filePath = join(__dirname, `../../assets/file/${filename}`)
    const file = fs.createReadStream(filePath)

    file.pipe(res)
  }

  // 从远程下载文件
  @Post('/api/download-file')
  async managementDownloadFileApi(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    const fileResponse = await this.managementService.getManagementFile(req, body);
    fileResponse.pipe(res)
  }

  @Post('/api/internal')
  async managementInternalAPI(@Req() req: Request, @Res() res: Response, @Body() body: ApiQeqDTO) {
    res.json(await this.managementService.requestInternal(req, body))
  }
}
