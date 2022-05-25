const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// tips: 这里还要发现以下为什么打包有问题
const devConfig = {
  mode: 'production',
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin()
  //   ],
  // }
  devtool: 'source-map', // prod 环境暂时开启source-map,定位到线上问题
  plugins: [
    new OptimizeCSSAssetsPlugin()
  ]
}

module.exports = merge(devConfig, baseConfig)
