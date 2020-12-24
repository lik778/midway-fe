import { CateItem } from '@/interfaces/shop';
import { AiTaskStatus } from '@/enums';

export interface CreateApiParams {
  contentCateId: number;
  shopId: number;
  wordA: string[];
  wordB: string[];
  wordC: string[];
  wordD: string[];
}

export interface AiShopList {
  id: number;
  name: string;
  articleCates: CateItem[];
  quotaInfo?:any;
}

export interface AiContentItem {
  shopId: number;
  id: number;
  articleNum: number;
  contentCateName: string;
  createdTime: number;
  status: AiTaskStatus;
}
