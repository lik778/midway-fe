import { defineConfig } from 'umi';

export default defineConfig({
  layout: {
    name: '百姓网',
    logo: '//file.baixing.net/202011/dc70acc77de03f734a229a542d70a5f4.png',
  },
  locale: {},
  nodeModulesTransform: {
    type: 'none',
  },
  "proxy": {
    "/management/api": {
      "target": "http://localhost:3000",
      "changeOrigin": true
    }
  }
});
