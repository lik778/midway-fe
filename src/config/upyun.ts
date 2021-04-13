export const upyunConfig = {
  "policy": {
    // TODO; 
    // bucket 回调的值
    "bucket": "bximg",
    "save-key": "/{filemd5}{.suffix}",
    "content-secret": "original",
    "content-length-range": "0,10485760",
    "x-gmkerl-type": "fix_max",
    "x-gmkerl-value": "3840",
    // 2B的又拍改了代码导致不认boolean true了，先用字符串的"true"
    "x-gmkerl-noicc": "true",
    "x-gmkerl-quality": "100",
    "x-gmkerl-rotate": "auto",
    // 2B的又拍改了代码导致不认boolean true了，先用字符串的"true"
    "x-gmkerl-exif-switch": "true",
    // TODO; 
    // bucket 回调的值
    "notify-url": "http://callback.img.baixing.net/upyun.php?bucket=bximg"
  },
  "form_api_secret": "icjvaWAQFMBkRfxuovi3xy3w3ik=",
  "operator": "php",
  "password": "ZhanglinZuiShuai!",
  "imageHost": undefined
}



