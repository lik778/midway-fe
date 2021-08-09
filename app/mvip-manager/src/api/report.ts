import {
  Response,
  ReportListResponse,
  ManagementListResponse,
  CateFlowOverviewData,
  CateFlowChartParams,
  CateFlowChartData,
  CateFlowDetailParams,
  FlowDetailData,
  BaxFlowOverviewData,
  BaxFlowChartParams,
  BaxFlowChartData,
  BaxFlowDetailParams,
  KeywordOverviewData,
  KeywordDetailListData,
  KeywordDetailListParams,
  SummaryOverviewData,
  FlowChartData,
  getLeaveMessageListParams,
  LeaveMessageListData
} from '@/interfaces/report';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { errorMessage } from '@/components/message';
import { inIframe } from '@/utils';

// 请求成功回调的 code
export const SUCCESS = 0

const request = axios.create({
  timeout: 10000, // request timeout  设置请求超时时间
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
})

request.interceptors.request.use((req: any) => {
  if (inIframe()) {
    req.url = `${req.url}${location.search}`
  }
  return Promise.resolve(req)
})

request.interceptors.response.use((res: AxiosResponse<any>) => {
  if (res.data && (res.data.code === 0 || res.data.code === 200)) {
    return Promise.resolve(res.data)
  } else {
    errorMessage('当前网络异常，请稍后重试', 0)
    return Promise.reject(res.data)
  }
}, (err: AxiosError) => {
  return Promise.reject(err.response && err.response.data)
})


/* 基础请求函数封装 */

type Method = 'post' | 'get'

const REPORT_PREFIX = '/report/api'
const MANAGEMENT_PREFIX = '/management/api'

const createRequest = (method: Method, BASE_URL: string): ((path: string, params?: any, headers?: any) => Response<any>) => {
  return (path: string, params?: any, headers?: any): Response<any> => {
    return request.post(BASE_URL, {
      method,
      path,
      params: method === 'post' ? params : null
    }, {
      headers
    })
  }
}
const post = createRequest('post', REPORT_PREFIX)
const get = createRequest('get', REPORT_PREFIX)
const postMidway = createRequest('post', MANAGEMENT_PREFIX)

/* 业务 API 定义 */

// 健康检查
export const reportHealth:
  () => Response<string> =
  () => get('/health')

// 总览概览
export const getSummaryOverviewData:
  () => Response<SummaryOverviewData> =
  () => get('/summary/overview')

// 总览汇总流量统计
export const getSummaryFlowData:
  () => Response<FlowChartData[]> =
  () => get('/summary/statistical')

// 快照流量总览数据
export const getCateFlowOverview:
  () => Response<CateFlowOverviewData> =
  () => get('/seo/network/overview')

// 快照流量统计柱状图
export const getCateFlowChart:
  (params: CateFlowChartParams) => Response<CateFlowChartData[]> =
  (params) => post('/seo/network/statistical', params)

// 快照流量详情列表
export const getCateFlowDetail:
  (params: CateFlowDetailParams) => ReportListResponse<FlowDetailData[]> =
  (params) => post('/seo/network/visit-detail', params)

// 广告流量概览
export const getBaxFlowOverview:
  () => Response<BaxFlowOverviewData> =
  () => get('/sem/network/overview')

// 广告流量访问和展现统计
export const getBaxFlowCharts:
  (params: BaxFlowChartParams) => Response<BaxFlowChartData[]> =
  (params) => post('/sem/network/statistical', params)

// 广告流量访问明细
export const getBaxFlowVisitDetail:
  (params: BaxFlowDetailParams) => ReportListResponse<FlowDetailData[]> =
  (params) => post('/sem/network/visit-detail', params)

// 广告流量展现明细
export const getBaxFlowShowDetail:
  (params: BaxFlowDetailParams) => ReportListResponse<FlowDetailData[]> =
  (params) => post('/sem/network/show-detail', params)

// 关键词概览数据
export const getKeywordOverview:
  () => Response<KeywordOverviewData> = () => get('/keyword/overview')

// 关键词详情
export const getKeywordDetailList:
  (params: KeywordDetailListParams) => ReportListResponse<KeywordDetailListData[]> =
  (params) => post('/keyword/detail', params)

// 获取留咨列表
export const getLeaveMessageList:
  (params: getLeaveMessageListParams) => ManagementListResponse<LeaveMessageListData[]> =
  (params) => postMidway('/api/midway/backend/messageCenter/messageListing', params)

// TODO delete mock data
// 以下是非 P0 页面的 Mock 数据

export const getRemainCtal = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        all: 216,
        filtered: 112
      }
    })
  })
}

export const getPublishData = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          key: i,
          date: String(20210101 + i).replace(/^(\d{4})(\d{2})/, '$1-$2-'),
          counts: [
            ~~(Math.random() * 200),
            ~~(Math.random() * 500),
            ~~(Math.random() * 1000),
            ~~(Math.random() * 800),
          ]
        }))
      }
    })
  })
}

export const getPublishDetails = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          key: i,
          date: String(20210101 + i).replace(/^(\d{4})(\d{2})/, '$1-$2-'),
          tiezi: ~~(Math.random() * 100),
          wenda: ~~(Math.random() * 100),
          article: ~~(Math.random() * 100),
          product: ~~(Math.random() * 100),
          all: ~~(Math.random() * 100),
        }))
      }
    })
  })
}

export const getRemainCapital = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        all: 216,
        filtered: 112
      }
    })
  })
}
