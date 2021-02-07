export default {
  env: 'production',
  services: {
    'midway-service': {
      host: 'http://midway-service'
    },
    'reporting-service': {
      host: 'http://api.baixing.com.cn'
    },
  },
  cdnPath: '//yxt.baixing.net',
  haojing: 'https://www.baixing.com',
  haojingDomain: 'baixing.com',
  hostType: {
    b2b: ':shopName.shop.baixing.com',
    fuwu: 'shop.baixing.com',
  }
}
