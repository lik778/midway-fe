export default {
  env: 'production',
  services: {
    'midway-service': {
      host: 'http://midway-service',
      external: 'https://cloud.baixing.com.cn'
    },
    'zhidao-service': {
      host: 'http://zhidao-service'
    },
    'post-tool-service': {
      host: 'http://api.baixing.com.cn'
    },
    'reporting-service': {
      host: 'http://api.baixing.com.cn'
    },
  },
  cdnPath: '//yxt.baixing.net',
  haojing: 'https://www.baixing.com',
  haojingDomain: 'baixing.com',
  hostType: {
    prefix: ':shopName.shop.baixing.:domain',
    base: 'shop.baixing.:domain'
  }
}
