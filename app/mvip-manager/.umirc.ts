import { defineConfig, IConfig } from 'umi';
//@ts-ignore
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';
const isProd = () => process.env.ENV === 'production'

const config: IConfig ={
  ...{
    title: '优选推后台管理',
    locale: {},
    hash: true,
    favicon: '//s.baixing.net/favicon.ico',
    base: '/management',
    nodeModulesTransform: {
      type: 'none',
    },
    define: {
      CUR_ENV: process.env.ENV
    },
    publicPath: isProd() ? '//yxt.baixing.net/assets/' : '/assets/',
    "proxy": {
      "/management/api": {
        "target": "http://localhost:7001",
        "changeOrigin": true
      },
      "/report/api": {
        "target": "http://localhost:7001",
        "changeOrigin": true
      },
      "/zhidao/api": {
        "target": "http://localhost:7001",
        "changeOrigin": true
      },
      "/post-tool/api": {
        "target": "http://localhost:7001",
        "changeOrigin": true
      },
      "/haojing/*": {
        "target": "http://localhost:7001",
        "changeOrigin": true
      },
      "/tracker/*": {
        "target": "http://localhost:7001",
        "changeOrigin": true
      },
      "/upyun/*": {
        "target": "http://localhost:7001",
        "changeOrigin": true
      },
    },
    dva: {
      skipModelValidate: true,
      immer: true,
    },
    mfsu: {},
    esbuild: {},
  },
  ...(isProd()?{chainWebpack(config) {
    config.merge({
      plugins: [new AntdDayjsWebpackPlugin()],
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 1,
          automaticNameDelimiter: '.',
          cacheGroups: {
            'vendors': {
              name: 'vendors',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            }
          },
        },
      }
    });
  },
  chunks: ['vendors', 'umi']}:{})
} 

export default defineConfig(config);
