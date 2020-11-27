import devConfig from './dev'
import prodConfig from './prod'

const config = {
  development: devConfig,
  production: prodConfig
}

const env = process.env.NODE_ENV || 'development'

export default () => config[env]
