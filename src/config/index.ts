import localConfig from './local'
import devConfig from './dev'
import testConfig from './test'
import prodConfig from './prod'

export const LOCAL_ENV = 'local'
export const DEVELOPMENT_ENV = 'development'
export const TEST_ENV = 'test'
export const PRODUCTION_ENV = 'production'

const config = {
  [LOCAL_ENV]: localConfig,
  [DEVELOPMENT_ENV]: devConfig,
  [TEST_ENV]: testConfig,
  [PRODUCTION_ENV]: prodConfig
}

const env = process.env.NODE_ENV || 'development'
export default () => config[env]
