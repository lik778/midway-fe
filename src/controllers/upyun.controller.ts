import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { upyunImgConfig, upyunVideoConfig } from '../config/upyun'
import { md5 } from '../util/common'
import config from '../config'

@Controller('/upyun')
export class UpyunController {

  /**
   * 获取又拍云上传图片配置 bucket bximg
   */
  @Get('/upyunImgConfig')
  async getUpyunImgConfig(@Req() req: Request, @Res() res: Response) {
    const vendor = 'upyun'
    const customPolicy = []
    const imageSuffix = '#up'
    const imgConfig = upyunImgConfig
    const uploadPolicy = {
      ...imgConfig['policy'],
      "expiration": new Date().getTime() + 3600 * 1000, customPolicy
    }

    const { encodedUploadPolicy, uploadSignature } = this.genUpyunSignature(uploadPolicy, imgConfig['form_api_secret'])

    const uploadParams = {
      'policy': encodedUploadPolicy,
      'signature': uploadSignature,
    }
    res.json({
      'uploadUrl': `${this.request_url_scheme(req)}://v0.api.upyun.com/${imgConfig.policy.bucket}/`,
      'uploadParams': uploadParams,
      'vendorName': vendor,
      'imageSuffix': imageSuffix,//用于image_id的识别，可以拼接在又拍返回的id后面
      'fileKey': 'file',//图片文件在form中的input的name名称
      'imageHost': imgConfig.imageHost ? `${this.request_url_scheme(req)}://${imgConfig.imageHost}` : null
    })
  }

  /**
   * 获取又拍云上传视频配置 bucket bxmedia
   */
  @Get('/upyunVideoConfig')
  async upyunVideoConfig(@Req() req: Request, @Res() res: Response) {
    const videoConfig = upyunVideoConfig
    const uploadPolicy = {
      ...videoConfig['policy'],
      "expiration": new Date().getTime() + 3600 * 1000
    }
    const { encodedUploadPolicy, uploadSignature } = this.genUpyunSignature(uploadPolicy, videoConfig['form_api_secret'])
    const uploadParams = {
      'policy': encodedUploadPolicy,
      'signature': uploadSignature,
    }
    res.json({
      'uploadUrl': `${this.request_url_scheme(req)}://v0.api.upyun.com/${videoConfig.policy.bucket}/`,
      'uploadParams': uploadParams,
      'vendorName': 'upyun',
      'suffix': '#videoup',
      'fileKey': 'file',
      'host': videoConfig.host ? `${this.request_url_scheme(req)}://${videoConfig.host}` : null
    })
  }

  /**
   * 获取又拍云上传视频带转码任务时的配置
   */
  @Get('/getUpyunTaskConfig')
  async getUpyunTaskConfig(@Req() req: Request, @Res() res: Response) {
    const { fileMD5, fileSuffix } = req.query
    const videoConfig = upyunVideoConfig
    const notifyBase = config().services['midway-service'].external
    const notifyURL = notifyBase + '/api/open/midway/up/decode'
    // * for test
    // const notifyURL = "https://enb6hk1stgczkkc.m.pipedream.net"
    // console.log('notifyURL:', notifyURL)
    // console.log('notifyURL:', `/nbhd_${fileMD5}${fileSuffix}`)
    const uploadPolicy = {
      ...videoConfig['policy'],
      apps: [{
        "name": "naga",
        "type": "video",
        "avopts": "",
        "save_as": `/nbhd_${fileMD5}${fileSuffix}`,
        "notify_url": notifyURL
      }],
      expiration: new Date().getTime() + 3600 * 1000
    }
    const { encodedUploadPolicy, uploadSignature } = this.genUpyunSignature(uploadPolicy, videoConfig['form_api_secret'])
    res.json({
      'policy': encodedUploadPolicy,
      'signature': uploadSignature,
    })
  }

  genUpyunSignature(uploadPolicy, formApiSecret) {
    const encodedUploadPolicy = Buffer.from(JSON.stringify(uploadPolicy)).toString('base64');
    return {
      encodedUploadPolicy,
      uploadSignature: md5(`${encodedUploadPolicy}&${formApiSecret}`)
    }
  }

  request_url_scheme(req: Request, with_colon = false) {
    let $return = 'https';
    if (with_colon) $return += ':';
    return $return;
  }
}
