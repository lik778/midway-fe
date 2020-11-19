import { defineConfig } from 'umi';
//import { UmiRule } from 'chain-css-loader'

export default defineConfig({
  layout: {},
  locale: {},
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    //{ path: '/', component: '@/pages/index' },
    // 动态路由
    { exact: true, path: '/articles/:id', component: '@/pages/articles/[id]' }, 
    { component: '@/pages/404' },
  ],
  // chainWebpack(config) {
  //   const rule = new UmiRule(config, {
  //     modules: true // start up CSS modules
  //   });
  //   rule.useStylus();
  //   return config;
  // }
});
