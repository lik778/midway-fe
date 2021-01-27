import { AiTaskStatus } from '../enums/verify';
export interface AiContentItem {
  shopId: number;
  id: number;
  articleNum: number;
  contentCateName: string;
  createdTime: number;
  status: AiTaskStatus;
}
