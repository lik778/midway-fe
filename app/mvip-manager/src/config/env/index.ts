import devConfig from './dev'
import testConfig from './test'
import prodConfig from './prod'
export const DEVELOPMENT_ENV = 'dev'
export const TEST_ENV = 'test'
export const PRODUCTION_ENV = 'production'
declare const CUR_ENV: string;

const config: any = {
  [DEVELOPMENT_ENV]: devConfig,
  [TEST_ENV]: testConfig,
  [PRODUCTION_ENV]: prodConfig
}

export default () => config[CUR_ENV || PRODUCTION_ENV]
