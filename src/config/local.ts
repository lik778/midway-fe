export default {
  env: 'local',
  services: {
    'midway-service': {
      host: 'http://172.30.2.14:31257'
      // host: 'http://172.17.0.255:8080'
    },
    'zhidao-service': {
      host: 'http://172.30.2.14:31252'
      // host: 'http://172.17.15.109:8080'
    },
    'reporting-service': {
      host: 'http://dev-api.baixing.cn'
    }
  },
  cdnPath: '',
  haojing: 'http://wulei.baixing.cn',
  haojingDomain: 'baixing.cn',
  hostType: {
    prefix: ':shopName.shop.baixing.cn',
    base: ''
  }
}
