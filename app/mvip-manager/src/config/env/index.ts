import devConfig from './dev'
import testConfig from './test'
import prodConfig from './prod'

const config: any = {
  development: devConfig,
  test: testConfig,
  production: prodConfig
}

const env = process.env.UMI_ENV || 'development'

export default () => config[env]
