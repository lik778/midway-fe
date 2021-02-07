import { AxiosResponse } from 'axios'
import { request } from '@/api/base'
import { stringify } from '@/utils'
import {
  ByDateData,
  CateFlowByDateParams,
  FlowDetailData,
  CateFlowDetailParams,
  CateFlowOverviewData,
  KeywordDetailData,
  KeywordDetailListParams,
  keywordOverviewData,
  ListResData,
  ReportResponse,
  BaxFlowParams
} from '@/interfaces/report'

/* 基础请求函数封装 */

type Response<T> = Promise<AxiosResponse<ReportResponse<T>>>
type ListResponse<T> = Response<T>

const REPORT_URL_PREFIX = '/report/api'

const createLocalRequest = (method: string): ((url: string, data?: any) => Response<any>) => {
  return (url: string, data?: any): Response<any> => {
    const { path = '', params = {} } = data || {}
    return request.post(REPORT_URL_PREFIX, {
      method,
      path: url + path,
      params: stringify(params)
    })
  }
}
const post = createLocalRequest('post')
const get = createLocalRequest('get')

/* 业务 API 定义 */

// 健康检查
export const reportHealthApi:
  () => Response<string> =
  () => get('/health')

// 主营流量接口
export const getCateFlowOverviewApi:
  () => Response<CateFlowOverviewData> =
  () => post('/seo/network/overview')

// 主营流量统计
export const getCateFlowByDateApi:
  (params: CateFlowByDateParams) => Response<ByDateData> =
  (params) => post('/seo/network/statistical', params)

// 主营流量列表
export const getCateFlowDetailApi:
  (params: CateFlowDetailParams) => ListResponse<FlowDetailData> =
  (params) => post('/seo/network/visit-detail', params)

// 搜索通流量概览
export const getBaxFlowOverviewApi:
  () => Response<any> =
  () => post('/sem/network/overview')

// 搜索通流量明细
export const getBaxFlowDetailApi:
  (params: BaxFlowParams) => ListResponse<FlowDetailData> =
  (params) => post('/sem/network/show-detail', params)

// 搜索通流量访问和展现统计
export const getBaxFlowStatisticalApi:
  (params: BaxFlowParams) => ListResponse<ByDateData> =
  (params) => post('/sem/network/statistical', params)


// 搜索通流量访问和展现统计
export const getBaxFlowVisitDetailApi:
  (params: BaxFlowParams) => ListResponse<FlowDetailData> =
  (params) => post('/sem/network/visit-detail', params)

// 关键词概览
export const getKeywordOverviewApi:
  () => Response<keywordOverviewData> =
  () => post('/keyword/overview')

// 关键词详情
export const getKeywordDetailListApi:
  (params: KeywordDetailListParams) => Response<ListResData<KeywordDetailData[]>> =
  (params) => post('/keyword/detail', params)




/* TODO mock data then */

// mock
export const getKeywordStatics = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        fm: 60,
        bw: 70,
        qc: 134,
        cate: 234
      }
    })
  })
}

export const getKeywordRankList = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          key: i,
          keyword: ['后曲小学桥架','江西鹰潭桥架','八一乡桥架材质'][~~(Math.random() * 3)],
          rank: ~~(Math.random() * 100),
          display: [1,2][~~(Math.random() * 2)],
          product: ['fm','bw','qc'][~~(Math.random() * 3)],
          search: ['baidu','360','shenma','sougou'][(~~(Math.random() * 3))],
        }))
      }
    })
  })
}

export const getPVData = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          date: String(20210101 + i).replace(/^(\d{4})(\d{2})/, '$1-$2-'),
          pv: ~~(Math.random() * 1000)
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

export const getPVList = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          key: i,
          pageURL: `https://shop.baixing.com/yhfangshui/n-${~~(Math.random()*10000)}.html`,
          ip: '183.21.240.***',
          time: '2021-01-19 21:10:08'
        }))
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
