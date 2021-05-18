const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { genSiteTemplateEntry } = require('./util');
const { TB_PAGE_NAMES_B2C_1, TB_PAGE_NAMES_B2B_2, TB_PAGE_NAMES_B2C_3, TB_TYPE_B2C_1, TB_TYPE_B2B_2, TB_TYPE_B2C_3 } = require('./constant');
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: Object.assign({
    'midway-admin': path.resolve(__dirname, '..', 'assets/midway-admin/main.tsx'),
    //特殊要额外加的打包示例
    //'site-template-2-about-pc': path.resolve(__dirname, '..', 'assets/site-template-2/pc/about/index.js')
  },
    genSiteTemplateEntry(TB_TYPE_B2C_1, TB_PAGE_NAMES_B2C_1),
    genSiteTemplateEntry(TB_TYPE_B2B_2, TB_PAGE_NAMES_B2B_2),
    genSiteTemplateEntry(TB_TYPE_B2C_3, TB_PAGE_NAMES_B2C_3),
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        'tb-vendors': {
          test: /[\\/]node_modules[\\/](jquery)[\\/]/,
          name: 'tb-vendors',
          chunks: 'all',
        },
        'tb-commons': {
          test: (module) => module.resource && module.resource.endsWith('.js'),
          name: 'tb-commons',
          chunks: 'initial',
          minChunks: 3
        }
      },
    },
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
