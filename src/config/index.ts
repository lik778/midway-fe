import localConfig from './local'
import devConfig from './dev'
import testConfig from './test'
import prodConfig from './prod'

const config = {
  local: localConfig,
  development: devConfig,
  test: testConfig,
  production: prodConfig
}

const env = process.env.NODE_ENV || 'development'
export default () => config[env]
