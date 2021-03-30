export default {
  env: 'test',
  services: {
    'midway-service': {
      host: 'http://172.30.2.14:30257'
    },
    'reporting-service': {
      host: 'http://dev-api.baixing.cn'
    }
  },
  cdnPath: '',
  haojing: 'http://wulei.baixing.cn',
  haojingDomain: 'baixing.cn',
  hostType: {
    prefix: ':shopName.shop-test.baixing.cn',
    base: 'shop-test.baixing.cn'
  }
}
