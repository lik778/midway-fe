import localConfig from './local'
import devConfig from './dev'
import testConfig from './test'
import test1Config from './test1'
import prodConfig from './prod'

export const LOCAL_ENV = 'local'
export const DEVELOPMENT_ENV = 'development'
export const TEST_ENV = 'test'
export const TEST1_ENV = 'test1'
export const PRODUCTION_ENV = 'production'

const config = {
  [LOCAL_ENV]: localConfig,
  [DEVELOPMENT_ENV]: devConfig,
  [TEST_ENV]: testConfig,
  [TEST1_ENV]: test1Config,
  [PRODUCTION_ENV]: prodConfig
}

const env = process.env.NODE_ENV || DEVELOPMENT_ENV
export default () => config[env]
