const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    'midway-admin': path.resolve(__dirname, '..', 'assets/midway-admin/main.tsx'),
    'site-template-1-home-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/home/index.js'),
    'site-template-1-home-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/home/index.js'),
    'site-template-1-news-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/news/index.js'),
    'site-template-1-news-child-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/news-child/index.js'),
    'site-template-1-news-detail-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/news-detail/index.js'),
    'site-template-1-news-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/news/index.js'),
    'site-template-1-news-child-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/news-child/index.js'),
    'site-template-1-product-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/product/index.js'),
    'site-template-1-product-child-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/product-child/index.js'),
    'site-template-1-product-detail-pc': path.resolve(__dirname, '..', 'assets/site-template-1/pc/product-detail/index.js'),
    'site-template-1-product-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/product/index.js'),
    'site-template-1-product-child-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/product-child/index.js'),
    'site-template-1-news-detail-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/news-detail/index.js'),
    'site-template-1-product-detail-wap': path.resolve(__dirname, '..', 'assets/site-template-1/wap/product-detail/index.js'),

    //新增模板2为B2B
    'site-template-2-home-pc': path.resolve(__dirname, '..', 'assets/site-template-2/pc/home/index.js'),
    'site-template-2-home-wap': path.resolve(__dirname, '..', 'assets/site-template-2/wap/home/index.js'),
    'site-template-2-news-pc': path.resolve(__dirname, '..', 'assets/site-template-2/pc/news/index.js'),
    'site-template-2-product-pc': path.resolve(__dirname, '..', 'assets/site-template-2/pc/product/index.js'),
    //'site-template-2-product-child-pc': path.resolve(__dirname, '..', 'assets/site-template-2/pc/product-child/index.js'),
    'site-template-2-product-detail-pc': path.resolve(__dirname, '..', 'assets/site-template-2/pc/product-detail/index.js'),
    'site-template-2-news-detail-pc': path.resolve(__dirname, '..', 'assets/site-template-2/pc/news-detail/index.js'),
    //'site-template-2-product-wap': path.resolve(__dirname, '..', 'assets/site-template-2/wap/product/index.js'),
    //'site-template-2-product-child-wap': path.resolve(__dirname, '..', 'assets/site-template-2/wap/product-child/index.js'),
    //'site-template-2-news-detail-wap': path.resolve(__dirname, '..', 'assets/site-template-2/wap/news-detail/index.js'),
    //'site-template-2-product-detail-wap': path.resolve(__dirname, '..', 'assets/site-template-2/wap/product-detail/index.js'),
  },
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
