import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import App from './App';
import { UpyunImgConfig } from './interfaces/common'
import { getUpyunImgConfigUpyun } from './api/common'
import { isLogin, isNotLocalEnv } from './utils'
import { HAO_JING_HOST } from './constants'
declare global {
  interface Window {
    __upyunImgConfig: UpyunImgConfig;
  }
}

// 一些全局请求直接放入window中
(async function () {
  // 用户未登录
  if (!isLogin() && isNotLocalEnv()) {
    location.href = `${HAO_JING_HOST}/oz/login?redirect=${encodeURIComponent(location.href)}`
    return <></>;
  }
  // 配置从镐京里提出来到node层
  const res = await getUpyunImgConfigUpyun()
  window.__upyunImgConfig = res
  ReactDOM.render(<App />, document.getElementById('root'));

})()

