import { defineConfig } from 'umi';

export default defineConfig({
  title: '站内千词后台管理',
  locale: {},
  hash: true,
  base: '/management',
  nodeModulesTransform: {
    type: 'none',
  },
  publicPath: '/assets/',
  "proxy": {
    "/management/api": {
      "target": "http://localhost:7001",
      "changeOrigin": true
    }
  }
});
