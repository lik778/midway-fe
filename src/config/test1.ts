export default {
  env: 'test1',
  services: {
    'midway-service': {
      host: 'http://172.30.2.14:30260'
    },
    'zhidao-service': {
      host: 'http://172.30.2.14:31252'
    },
    'reporting-service': {
      host: 'http://dev-api.baixing.cn'
    }
  },
  cdnPath: '//yxt.baixing.net',
  haojing: 'http://wulei.baixing.cn',
  haojingDomain: 'baixing.cn',
  hostType: {
    prefix: ':shopName.shop-test1.baixing.:domain',
    base: 'shop-test1.baixing.:domain'
  }
}
