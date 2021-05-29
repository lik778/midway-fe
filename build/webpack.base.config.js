const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { genSiteTemplateEntry } = require('./util');
const { TB_FUWU_PAGE_NAMES, TB_B2B_PAGE_NAMES, TB_B2C_PAGE_NAMES, TB_FUWU_TYPE, TB_B2B_TYPE, TB_B2C_TYPE } = require('./constant');
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: Object.assign({
    'midway-admin': path.resolve(__dirname, '..', 'assets/midway-admin/main.tsx'),
    'sem-home-pc': path.resolve(__dirname, '..', 'assets/sem/pc/home/index.js'),
    'sem-home-wap': path.resolve(__dirname, '..', 'assets/sem/wap/home/index.js')
    //'site-template-2-about-pc': path.resolve(__dirname, '..', 'assets/site-template-2/pc/about/index.js')
  },
    genSiteTemplateEntry(TB_FUWU_TYPE, TB_FUWU_PAGE_NAMES),
    genSiteTemplateEntry(TB_B2B_TYPE, TB_B2B_PAGE_NAMES),
    genSiteTemplateEntry(TB_B2C_TYPE, TB_B2C_PAGE_NAMES),
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
