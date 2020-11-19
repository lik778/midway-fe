const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  watch: true,
  devtool: 'source-map',
  mode: 'development',
  entry: {
    'site-template-1-home-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/home/index.js'),
    'site-template-1-home-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/home/index.js'),
    'site-template-1-news-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/news/index.js'),
    'site-template-1-product-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/product/index.js')
  },
  output: {
    path: path.resolve(__dirname, "../dist/public"),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
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

}
