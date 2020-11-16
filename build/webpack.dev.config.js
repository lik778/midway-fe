const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  watch: true,
  devtool: 'source-map',
  mode: 'development',
  entry: {
    'site-template-1-home': path.resolve(__dirname, '..', 'assets/pc/site-template-1-home/index.js'),
    'site-template-1-news': path.resolve(__dirname, '..', 'assets/pc/site-template-1-news/index.js'),
    'site-template-1-product': path.resolve(__dirname, '..', 'assets/pc/site-template-1-product/index.js')
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
