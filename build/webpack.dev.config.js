const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// todo: 这里的递归获取文件要修改
const list = glob.sync(path.resolve(__dirname, '..', 'assets/styles/*.styl'));

console.log(list)
module.exports = {
  watch: true,
  mode: 'development',
  entry: list,
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
        test: /\.styl(us)?$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader']
      },
    ]
  },

}
