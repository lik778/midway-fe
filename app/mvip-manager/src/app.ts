import { getUpyunImgConfig } from './api/haojing'
import { UpyunImgConfig } from '@/interfaces/haojing';
import '@/styles/common.less';

declare global {
  interface Window {
    __upyunImgConfig: UpyunImgConfig;
  }
}

// 一些全局请求直接放入window中
(async function () {
  const upYunConfig = await getUpyunImgConfig()
  window.__upyunImgConfig = upYunConfig
})()

