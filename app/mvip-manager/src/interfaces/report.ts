// 报表关键词
import { BaxProductType, CateProductType,
  DisplayType, PlatformType } from '@/enums/report';

export interface BaseParams {
  user_id: number;
}

export interface KeywordDetailListParams extends BaseParams {
  device: DisplayType;
  pageNo: number;
  pageSize: number;
  platform: PlatformType;
  product: BaxProductType | CateProductType
}
