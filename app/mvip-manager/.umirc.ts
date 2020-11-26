import { defineConfig } from 'umi';

export default defineConfig({
  locale: {},
  nodeModulesTransform: {
    type: 'none',
  },
  "proxy": {
    "/management/api": {
      "target": "http://localhost:7001",
      "changeOrigin": true
    }
  }
});
