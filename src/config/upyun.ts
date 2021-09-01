export const upyunImgConfig = {
  "policy": {
    "bucket": "bximg",
    "save-key": "/{filemd5}{.suffix}",
    "content-secret": "original",
    "content-length-range": "0,10485760",
    "x-gmkerl-type": "fix_max",
    "x-gmkerl-value": "3840",
    "x-gmkerl-noicc": "true",
    "x-gmkerl-quality": "100",
    "x-gmkerl-rotate": "auto",
    "x-gmkerl-exif-switch": "true",
    "notify-url": "http://callback.img.baixing.net/upyun.php?bucket=bximg"
  },
  "form_api_secret": "icjvaWAQFMBkRfxuovi3xy3w3ik=",
  "operator": "node",
  "password": "ZhanglinZuiShuai!",
  "imageHost": undefined
}

/* @see https://help.upyun.com/knowledge-base/av/#e5b8b8e794a8e58f82e695b0 */
export const upyunVideoConfig = {
  host: 'http://bxmedia.baixing.net',
  form_api_secret: "9sMCIBryAo8INghVqfOQXtsvTNI=",
  operateHost: 'http://p0.api.upyun.com',
  policy: {
    "bucket": "bxmedia",
    "save-key": "/{filemd5}{.suffix}",
    "type": "nbhd",
    "advote": "/s/720p(16:9)/r/25/sm/false/ar/22050",
    "notify-url": "https://enb6hk1stgczkkc.m.pipedream.net",
    "ext-param": "source=msshop&s=720p&type=mvip-encode"
  },
}
