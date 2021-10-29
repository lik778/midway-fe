export default {
  env: 'test',
  services: {
    'midway-service': {
      host: 'http://172.30.2.14:30257',
      external: 'http://midway.test-cat.cloud.baixing.cn'
    },
    'zhidao-service': {
      host: 'http://172.30.2.14:31252'
    },
    'post-tool-service': {
      host: 'http://172.30.2.14:31204'
    },
    'reporting-service': {
      host: 'http://dev-api.baixing.cn'
    }
  },
  cdnPath: '',
  haojing: 'http://wulei.baixing.cn',
  haojingDomain: 'baixing.cn',
  hostType: {
    prefix: ':shopName.shop-test.baixing.:domain',
    base: 'shop-test.baixing.:domain'
  }
}
