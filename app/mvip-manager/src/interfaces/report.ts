// 报表关键词
import {
  BaxProductType,
  CateProductType,
  DisplayType,
  PlatformType
} from '@/enums/report';

/* 请求类型 */

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export type Response<T> = Promise<BaseResponse<T>>

export interface ListResData<T> {
  totalElements: number;
  totalPages: number;
  result: T;
}

export type ListResponse<T> = Response<ListResData<T>>

/* 业务数据类型约束 */

export interface BaseParams {
  userId: number;
}

export interface PaginationParams {
  pageNo: number;
  pageSize: number;
}

// 主营流量页面

export interface CateFlowOverviewData extends BaseParams {
  totalVisits: number;
  last15DayVisits: number;
  last30DayVisits: number;
}

export interface CateFlowChartParams extends BaseParams {
  endTime: string;
  startTime: string;
  product: CateProductType;
}

export interface CateFlowChartData {
  date: string;
  visits: number;
}

export interface CateFlowDetailParams extends BaseParams, PaginationParams {
  startTime: string;
  endTime: string;
  platform: PlatformType;
  product: CateProductType;
}

export interface FlowDetailData {
  webPage: string;
  ip: string;
  time: string;
  keyword: string;
  platform: PlatformType;
  product: CateProductType | BaxProductType;
}

// TODO 对接口

export interface KeywordDetailListParams extends BaseParams {
  device: DisplayType;
  pageNo: number;
  pageSize: number;
  platform: PlatformType;
  product: BaxProductType | CateProductType;
}

export interface keywordOverviewProductDetail {
  main: number;
  biaoWang: number;
  fengMing: number;
  yiHuiTui: number;
}

export interface keywordOverviewData {
  total: number;
  mainTotal: number;
  searchTotal: number;
  distributionDetail: keywordOverviewProductDetail;
  rankingDetail: keywordOverviewProductDetail;
}

export interface KeywordDetailData {
  device: DisplayType;
  keyword: string;
  platformType: PlatformType;
  product: BaxProductType | CateProductType;
  ranking: number;
}

export interface BaxFlowParams extends CateFlowChartParams {
  product: BaxProductType
}
