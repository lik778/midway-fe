export default {
  env: 'local',
  services: {
    'midway-service': {
      host: 'http://172.30.2.14:30263',
      // host: 'http://172.17.13.108:8080',
      external: 'http://midway.test-cat.cloud.baixing.cn'
    },
    'zhidao-service': {
      host: 'http://172.30.2.14:31252'
      // host: 'http://172.17.3.110:8080'
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
    prefix: ':shopName.shop.baixing.:domain',
    base: ''
  }
}
