import { defineConfig } from 'umi';

export default defineConfig({
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
  publicPath: process.env.ENV === 'production' ? '//yxt.baixing.net/assets/' : '/assets/',
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
  esbuild: {}
});
