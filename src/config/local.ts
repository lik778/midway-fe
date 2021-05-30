export default {
  env: 'local',
  services: {
    'midway-service': {
      //这里30257是test环境，31257是dev环境
      host: 'http://172.30.2.14:30257'
      // host: 'http://172.17.12.245:8080'
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
    prefix: ':shopName.shop.baixing.cn',
    base: ''
  }
}
