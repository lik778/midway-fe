const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { genSiteTemplateEntry } = require('./util');
const { SITE_TEMPLATE_1_PAGE_NAMES } = require('./constant');
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: Object.assign({
    'midway-admin': path.resolve(__dirname, '..', 'assets/midway-admin/main.tsx')
    }, genSiteTemplateEntry(1, SITE_TEMPLATE_1_PAGE_NAMES, [
      path.resolve(__dirname, '..', 'assets/common/index.js')
    ]), genSiteTemplateEntry(2, SITE_TEMPLATE_2_PAGE_NAMES, [
      path.resolve(__dirname, '..', 'assets/common/index.js')
    ]),
  ),
  output: {
    path: path.resolve(__dirname, "../dist/public"),
    filename: isProd? '[name].[contenthash].js' : '[name].js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.less', '.js', '.json'],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.(js)$/,
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
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            },
          }, 'css-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[contenthash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[contenthash].css' : '[id].css',
    }),
    // new HtmlWebpackPlugin({
    //   filename: path.resolve(__dirname, "../dist/public/midway-admin.html"),
    //   chunks: ['midway-admin']
    // })
  ]
}
