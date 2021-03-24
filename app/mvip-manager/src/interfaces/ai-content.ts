import { CateItem } from '@/interfaces/shop';
import { AiTaskStatus } from '@/enums';

export interface AiTaskApiParams {
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
  isSupportAi: boolean;
}

export interface AiContentItem {
  shopId: number;
  id: number;
  articleNum: number;
  contentCateName: string;
  contentCateId: number;
  createdTime: number;
  status: AiTaskStatus;
  topArticleNum: number;
  yesterdayArticleNum: number;
  memo: string;
  wordA: string[];
  wordB: string[];
  wordC: string[];
  wordD: string[];
}


export interface ChooseWord {
  wordsGrouped:{
    "AC": {
     id:number,
     seoWord:string,
     type:string
    },
    "ABC": {
      id:number,
      seoWord:string,
      type:string
     },
     "ACD": {
      id:number,
      seoWord:string,
      type:string
     },
     "ABCD": {
      id:number,
      seoWord:string,
      type:string
     },
  }
}