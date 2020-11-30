const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// tips: 这里还要发现以下为什么打包有问题
const devConfig = {
  mode: 'production',
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin()
  //   ],
  // }
}

module.exports = merge(devConfig, baseConfig)
