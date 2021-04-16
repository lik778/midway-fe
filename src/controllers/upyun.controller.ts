// 必须引入crypto
const crypto = require('crypto');
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { HaojingService } from '../services/haojing.service';
import { upyunConfig } from '../config/upyun'
import { md5 } from '../util/common'
import { LOCAL_ENV, DEVELOPMENT_ENV, TEST_ENV, PRODUCTION_ENV } from '../config/index'

@Controller('/upyun')
export class UpyunController {

  @Get('/upyunImgConfig')
  async getUpyunImgConfig(@Req() req: Request, @Res() res: Response) {
    const vendor = 'upyun'
    const customPolicy = []
    const imageSuffix = '#up'
    const imgConfig = upyunConfig
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

  genUpyunSignature(uploadPolicy, formApiSecret) {
    const encodedUploadPolicy = Buffer.from(JSON.stringify(uploadPolicy)).toString('base64');
    return {
      encodedUploadPolicy,
      uploadSignature: md5(`${encodedUploadPolicy}&${formApiSecret}`)
    }
  }


  request_url_scheme(req: Request, with_colon = false) {
    const env = process.env.NODE_ENV || DEVELOPMENT_ENV
    let $return = 'http';
    if (env === PRODUCTION_ENV) {
      if (req.headers['X-eBay-Request-Proto'] == 'HTTPS') {
        $return = 'https';
      } else if (req.headers["HTTP_X_EBAY_REQUEST_PROTO"]
        && req.headers["HTTP_X_EBAY_REQUEST_PROTO"] == 'HTTPS'
      ) {
        $return = 'https';
      }
    } else { // 线下
      // TODO;
      // if (isset($GLOBALS['_SERVER']['HTTPS']) && $GLOBALS['_SERVER']['HTTPS'] == 'on') {
      // $return = 'https';
      // }
    }
    if (with_colon) $return += ':';
    return $return;
  }
}
