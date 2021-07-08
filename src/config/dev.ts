export default {
  env: 'development',
  services: {
    'midway-service': {
      host: 'http://172.30.2.14:31257'
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
    prefix: ':shopName.shop.baixing.:domain',
    base: 'shop.baixing.:domain'
  }
}
