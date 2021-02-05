import { postApi } from '@/api/base'
import {
  ByDateData, CateFlowByDateParams, FlowDetailData,
  CateFlowDetailParams, CateFlowOverviewData, KeywordDetailData,
  KeywordDetailListParams, keywordOverviewData,
  ListResData, ReportResponse, BaxFlowParams} from '@/interfaces/report';
import { AxiosResponse } from 'axios';
/* 关键词 */
const API_PREFIX = '/report/api'
const GET_BASE_DATA = { method: 'get', params: null }
const POST_BASE_DATA = { method: 'post' }

const serializationData = function <T>(params: T): string {
  return JSON.stringify(params)
}

// api 健康检查
export const reportHealthApi = () => {
  return postApi(API_PREFIX, { path: '/health', ...GET_BASE_DATA })
}

// 主营流量报表
// api: 主营概览
export const getCateFlowOverviewApi = (): Promise<AxiosResponse<ReportResponse<CateFlowOverviewData>>> => {
  return postApi(API_PREFIX, { path: '/seo/network/overview', ...GET_BASE_DATA })
}

// api: 主营流量统计
export const getCateFlowByDateApi = (params: CateFlowByDateParams): Promise<AxiosResponse<ReportResponse<ByDateData>>> => {
  return postApi(API_PREFIX, { path: '/seo/network/statistical', ...POST_BASE_DATA, params: serializationData(params) })
}
// api: 主营流量详情
export const getCateFlowDetailApi = (params: CateFlowDetailParams): Promise<AxiosResponse<ReportResponse<ListResData<FlowDetailData>>>> => {
  return postApi(API_PREFIX, { path: '/seo/network/visit-detail', ...POST_BASE_DATA, params: serializationData(params) })
}

// 搜索通流量报表
// api: 搜索通概览
export const getBaxFlowOverviewApi = (): Promise<AxiosResponse<ReportResponse<any>>> => {
  return postApi(API_PREFIX, { path: '/sem/network/overview', ...GET_BASE_DATA })
}

// api: 搜索通流量展现明细
export const getBaxFlowDetailApi = (params: BaxFlowParams): Promise<AxiosResponse<ReportResponse<ListResData<FlowDetailData>>>> => {
  return postApi(API_PREFIX, { path: '/sem/network/show-detail', ...POST_BASE_DATA, params: serializationData(params) })
}

// api: 搜索通流量访问和展现统计
export const getBaxFlowStatisticalApi = (params: BaxFlowParams): Promise<AxiosResponse<ReportResponse<ListResData<ByDateData>>>> => {
  return postApi(API_PREFIX, { path: '/sem/network/statistical', ...POST_BASE_DATA, params: serializationData(params) })
}

// api: 搜索通流量访问和展现统计
export const getBaxFlowVisitDetailApi = (params: BaxFlowParams): Promise<AxiosResponse<ReportResponse<ListResData<FlowDetailData>>>> => {
  return postApi(API_PREFIX, { path: '/sem/network/visit-detail', ...POST_BASE_DATA, params: serializationData(params) })
}

// 关键词报表
// api: 概览
export const getKeywordOverviewApi = (): Promise<AxiosResponse<ReportResponse<keywordOverviewData>>> => {
  return postApi(API_PREFIX, { path: '/keyword/overview', ...GET_BASE_DATA })
}

// api: 获取关键词详情
export const getKeywordDetailListApi = (params: KeywordDetailListParams): Promise<AxiosResponse<ReportResponse<ListResData<KeywordDetailData[]>>>> => {
  return postApi(API_PREFIX, { path: '/keyword/detail',
    ...POST_BASE_DATA, params: serializationData(params) })
}


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
