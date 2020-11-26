import { defineConfig } from 'umi';

export default defineConfig({
  locale: {},
  nodeModulesTransform: {
    type: 'none',
  },
  "proxy": {
    "/management/api": {
      "target": "http://localhost:8001",
      "changeOrigin": true
    }
  }
});
