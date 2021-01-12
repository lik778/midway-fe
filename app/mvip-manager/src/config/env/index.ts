import devConfig from './dev'
import testConfig from './test'
import prodConfig from './prod'

export const DEVELOPMENT_ENV = 'development'
export const TEST_ENV = 'test'
export const PRODUCTION_ENV = 'production'

const config: any = {
  [DEVELOPMENT_ENV]: devConfig,
  [TEST_ENV]: testConfig,
  [PRODUCTION_ENV]: prodConfig
}

const env = process.env.ENV || DEVELOPMENT_ENV

export default () => config[env]
