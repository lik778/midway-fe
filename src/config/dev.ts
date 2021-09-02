export default {
  env: 'development',
  services: {
    'midway-service': {
      host: 'http://172.30.2.14:31257',
      external: 'http://midway.cat.upyun.baixing.cn'
    },
    'zhidao-service': {
      host: 'http://172.30.2.14:31252'
    },
    'reporting-service': {
      host: 'http://dev-api.baixing.cn'
    }
  },
  cdnPath: '',
  haojing: 'http://wulei.baixing.cn',
  haojingDomain: 'baixing.cn',
  hostType: {
    prefix: ':shopName.shop-dev.baixing.:domain',
    base: 'shop-dev.baixing.:domain'
  }
}
