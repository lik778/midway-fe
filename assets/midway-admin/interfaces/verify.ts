import { AiTaskStatus } from '../enums/verify';

enum SEO_STATUS {
    DEFAULT= 'DEFAULT',
    APPROVE= 'APPROVE',
    REJECT= 'REJECT'
}
export interface VerifyWordItem {
  usrId: number;
  shopId: number;
  taskId: number;
  contentCateName: string;
  createdTime: number;
  status: AiTaskStatus;
  memo: string;
  wordA: string[];
  wordB: string[];
  wordC: string[];
  wordD: string[];
}

export interface VerifyWordParams {
  approve: boolean;
  id: number;
  memo?: string;
}

export type checkListItem = {
    id?: string,
    shopName?: string,
    status?: SEO_STATUS,
    userId?: string
}

export interface pageData {
    pageSize?: number,
    result?: Array<any>
    totalPage?: number,
    totalRecord?: number
}

export interface SeoCheckList extends pageData {
    result?: Array<checkListItem>
} 
