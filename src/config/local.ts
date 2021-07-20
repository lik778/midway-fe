export default {
  env: 'local',
  services: {
    'midway-service': {
      host: 'http://172.17.9.18:8080'
      // host: 'http://172.30.2.14:30263'
    },
    'zhidao-service': {
      host: 'http://172.30.2.14:31252'
      // host: 'http://172.17.3.110:8080'
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
