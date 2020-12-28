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
  publicPath: '/assets/',
  "proxy": {
    "/management/api": {
      "target": "http://localhost:7001",
      "changeOrigin": true
    },
    "/haojing/*": {
      "target": "http://localhost:7001",
      "changeOrigin": true
    },
  }
});
