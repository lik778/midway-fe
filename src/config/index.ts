import localConfig from './local'
import devConfig from './dev'
import testConfig from './test'
import test1Config from './test1'
import test2Config from './test2'
import prodConfig from './prod'

export const LOCAL_ENV = 'local'
export const DEVELOPMENT_ENV = 'dev'
export const TEST_ENV = 'test'
export const TEST1_ENV = 'test1'
export const TEST2_ENV = 'test2'
export const PRODUCTION_ENV = 'production'

const config = {
  [LOCAL_ENV]: localConfig,
  [DEVELOPMENT_ENV]: devConfig,
  [TEST_ENV]: testConfig,
  [TEST1_ENV]: test1Config,
  [TEST2_ENV]: test2Config,
  [PRODUCTION_ENV]: prodConfig
}

const env = process.env.NODE_ENV || DEVELOPMENT_ENV
export default () => config[env]
