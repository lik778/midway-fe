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

export interface ReportListResData<T> {
  totalElements: number;
  totalPages: number;
  result: T;
}

export type ReportListResponse<T> = Response<ReportListResData<T>>

/* 业务数据类型约束 */

export interface BaseParams {
  userId: number;
}

export interface PageParams {
  pageNo: number;
  pageSize: number;
}

export interface FlowChartData {
  date: string;
  visits: number;
}

export interface SummaryOverviewData {
  biaoWangKeyword: number;
  fengMingKeyword: number;
  mainTotalKeyword: number;
  searchTotalKeyword: number;
  totalKeyword: number;
  totalVisits: number;
  yiHuiTuiKeyword: number;
}

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

export interface CateFlowChartData extends FlowChartData { }

export interface CateFlowDetailParams extends BaseParams, PageParams {
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

export interface BaxFlowOverviewData extends BaseParams {
  last15DayShows: number;
  last15DayVisits: number;
  last30DayShows: number;
  last30DayVisits: number;
  totalShows: number;
  totalVisits: number;
}

export interface BaxFlowChartParams extends BaseParams {
  endTime: string;
  startTime: string;
  product: BaxProductType;
}

export interface BaxFlowChartData  extends FlowChartData {
  shows: number;
}

export interface BaxFlowDetailParams extends BaseParams, PageParams {
  startTime: string;
  endTime: string;
  platform: PlatformType;
  product: BaxProductType;
}


export interface KeywordOverviewData {
  total: number;
  mainTotal: number;
  searchTotal: number;
  biaoWangKeyword: number;
  biaoWangRanking: number;
  fengMingKeyword: number;
  fengMingRanking: number;
  yiHuiTuiKeyword: number;
  yiHuiTuiRanking: number;
}

export interface KeywordDetailListParams extends BaseParams, PageParams {
  device: DisplayType;
  platform: PlatformType;
  product: BaxProductType | CateProductType;
}

export interface KeywordDetailListData {
  device: DisplayType;
  keyword: string;
  platform: PlatformType;
  product: BaxProductType | CateProductType;
  ranking: number;
  url: string;
  isExcellentWord: boolean;
}
