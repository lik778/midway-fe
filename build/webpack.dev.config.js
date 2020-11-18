const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const devConfig = {
  watch: true,
  devtool: 'source-map',
  mode: 'development'
}

module.exports = merge(devConfig, baseConfig)
