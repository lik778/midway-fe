import { getUpyunImgConfigUpyun, getUpyunVideoConfigUpyun, getUpyunTaskConfig } from './api/upyun'
import { UpyunImgConfig, UpyunVideoConfig, UpyunGenTaskParams, UploadParams } from '@/interfaces/haojing';
import { enableMapSet } from 'immer';
import '@/styles/report.less';
import '@/styles/common.less';
import { inIframe, insertStyle, notInIframe } from '@/utils';

declare global {
  interface Window {
    __upyunImgConfig: UpyunImgConfig;
    __upyunVideoConfig: UpyunVideoConfig;
    __upyunGetTaskConfig: (params: UpyunGenTaskParams) => Promise<UploadParams>;
  }
}

// 一些全局请求直接放入window中
(async function () {
  enableMapSet()
  if (inIframe()) {
    insertStyle(`
      @media screen and (max-width: 700px) {
        .page-report .statics-con .ant-statistic-title {
          font-size: 14px;
        }
        .page-report .statics-con .ant-statistic-content-value {
          font-size: 18px;
        }
        .page-report .react-echarts {
          height: 200px !important;
        }
      }
      @media screen and (max-width: 370px) {
        .page-report .statics-con .ant-statistic-title {
          text-overflow: ellipsis;
        }
      }
    `)
  }
  if (notInIframe()) {
    // 配置从镐京里提出来到node层
    const [
      upyunImgConfig,
      upyunVideoConfig
    ] = await Promise.all([
      getUpyunImgConfigUpyun(),
      getUpyunVideoConfigUpyun()
    ])
    window.__upyunImgConfig = upyunImgConfig
    window.__upyunVideoConfig = upyunVideoConfig
    window.__upyunGetTaskConfig = getUpyunTaskConfig
  }

})()

