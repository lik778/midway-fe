// 报表关键词
import { BaxProductType, CateProductType,
  DisplayType, PlatformType } from '@/enums/report';

export interface ReportResponse<T> {
  data: T;
  message: string;
  code: number;
}

export interface ListResData<T> {
  result: T;
  totalElements: number;
  totalPages: number;
}

export interface BaseParams {
  userId: number;
}

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

export interface CateFlowOverviewData {
  userId: string;
  totalVisits: number;
  last15DayVisits: number;
  last30DayVisits: number;
}

export interface CateFlowByDateParams {
  endTime: string;
  startTime: string;
  userId: number;
}

export interface ByDateData {
  date: string;
  visits: number;
  show?: number;
}

export interface CateFlowDetailParams extends BaseParams {
  startTime: string;
  endTime: string;
  pageNo: number;
  pageSize: number;
  platform: PlatformType;
  product: CateProductType;
}

export interface FlowDetailData {
  webPage: string;
  ip: string;
  time: string;
  platform: PlatformType;
  keyword: string;
  product: CateProductType | BaxProductType;
}

export interface BaxFlowParams extends CateFlowByDateParams {
  product: BaxProductType
}
