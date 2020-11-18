const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const devConfig = {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin()
    ],
  }
}

module.exports = merge(devConfig, baseConfig)
