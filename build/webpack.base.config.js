const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    'site-template-1-home-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/home/index.js'),
    'site-template-1-home-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/home/index.js'),
    'site-template-1-news-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/news/index.js'),
    'site-template-1-news-child-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/news-child/index.js'),
    'site-template-1-news-detail-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/news-detail/index.js'),
    'site-template-1-news-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/news/index.js'),
    'site-template-1-product-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/product/index.js'),
    'site-template-1-product-child-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/product-child/index.js'),
    'site-template-1-product-detail-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/product-detail/index.js'),
    'site-template-1-product-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/product/index.js'),
    'site-template-1-news-detail-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/news-detail/index.js'),
  },
  output: {
    path: path.resolve(__dirname, "../dist/public"),
    filename: isProd? '[name].[contenthash].js' : '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.styl(us)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            },
          }, 'css-loader', 'stylus-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[contenthash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[contenthash].css' : '[id].css',
    })
  ]
}
