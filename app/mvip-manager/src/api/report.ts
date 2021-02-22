import { request } from '@/api/base'
import {
  Response,
  ListResponse,
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
} from '@/interfaces/report'

// 请求成功回调的 code
export const SUCCESS = 0

/* 基础请求函数封装 */

type Method = 'post' | 'get'

const REPORT_URL_PREFIX = '/report/api'

const createRequest = (method: Method): ((path: string, params?: any) => Response<any>) => {
  return (path: string, params?: any): Response<any> => {
    return request.post(REPORT_URL_PREFIX, {
      method,
      path,
      params: method === 'post' ? params : null
    })
  }
}
const post = createRequest('post')
const get = createRequest('get')

/* 业务 API 定义 */

// 健康检查
export const reportHealth:
  () => Response<string> =
  () => get('/health')

// 主营流量总览数据
export const getCateFlowOverview:
  () => Response<CateFlowOverviewData> =
  () => get('/seo/network/overview')

// 主营流量统计柱状图
export const getCateFlowChart:
  (params: CateFlowChartParams) => Response<CateFlowChartData[]> =
  (params) => post('/seo/network/statistical', {...params, product: ''})

// 主营流量详情列表
export const getCateFlowDetail:
  (params: CateFlowDetailParams) => ListResponse<FlowDetailData[]> =
  (params) => post('/seo/network/visit-detail', {...params, product: '', platform: ''})

// 搜索通流量概览
export const getBaxFlowOverview:
  () => Response<BaxFlowOverviewData> =
  () => get('/sem/network/overview')

// 搜索通流量访问和展现统计
export const getBaxFlowCharts:
  (params: BaxFlowChartParams) => Response<BaxFlowChartData[]> =
  (params) => post('/sem/network/statistical', {...params, product: ''})

// 搜索通流量访问明细
export const getBaxFlowVisitDetail:
  (params: BaxFlowDetailParams) => ListResponse<FlowDetailData[]> =
  (params) => post('/sem/network/visit-detail', {...params, product: '', platform: ''})

// 搜索通流量展现明细
export const getBaxFlowShowDetail:
  (params: BaxFlowDetailParams) => ListResponse<FlowDetailData[]> =
  (params) => post('/sem/network/show-detail', {...params, product: '', platform: ''})

// 关键词概览数据
export const getKeywordOverview:
  () => Response<KeywordOverviewData> = () => get('/keyword/overview')

// 关键词详情
export const getKeywordDetailList:
  (params: KeywordDetailListParams) => ListResponse<KeywordDetailListData[]> =
  (params) => post('/keyword/detail', {...params, product: '', platform: ''})

// TODO delete mock data

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
