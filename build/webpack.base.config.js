const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { genSiteTemplateEntry } = require('./util');
const { TB_PAGE_NAMES_B2C_1, TB_PAGE_NAMES_B2B_2, TB_PAGE_NAMES_B2C_3, TB_TYPE_B2C_1, TB_TYPE_B2B_2, TB_TYPE_B2C_3 } = require('./constant');
const isProd = process.env.NODE_ENV === 'production'
const isLocal = process.env.NODE_ENV === 'local'

console.log('[BUILD ENV]', process.env.NODE_ENV)

const assign = (...args) => Object.assign(args.filter(x => x))

// tips: path.resolve(__dirname, '..', 'assets/common/index.js') 这里面的代码是搜索通打点的，
// 每次更新一个模板，都需要添加
module.exports = {
  entry: assign(
    {
      'midway-admin': path.resolve(__dirname, '..', 'assets/midway-admin/main.tsx')
    },
    {
      'sem-home-pc': [
        path.resolve(__dirname, '..', 'assets/sem/pc/home/index.js'),
        path.resolve(__dirname, '..', 'assets/common/index.js')
      ],
      'sem-home-wap': [
        path.resolve(__dirname, '..', 'assets/sem/wap/home/index.js'),
        path.resolve(__dirname, '..', 'assets/common/index.js')
      ]
    },
    genSiteTemplateEntry(TB_TYPE_B2C_1, TB_PAGE_NAMES_B2C_1, [
      path.resolve(__dirname, '..', 'assets/common/index.js')
    ]),
    genSiteTemplateEntry(TB_TYPE_B2B_2, TB_PAGE_NAMES_B2B_2, [
      path.resolve(__dirname, '..', 'assets/common/index.js')
    ]),
    genSiteTemplateEntry(TB_TYPE_B2C_3, TB_PAGE_NAMES_B2C_3, [
      path.resolve(__dirname, '..', 'assets/common/index.js')
    ]),
  ),
  output: {
    path: path.resolve(__dirname, "../dist/public"),
    filename: isProd ? '[name].[contenthash].js' : '[name].js'
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
          loader: 'ts-loader',
          options: {
            transpileOnly: isLocal ? false : true
          }
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
    })
  ]
}
