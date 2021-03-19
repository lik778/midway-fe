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


/** 问答任务列表 */
export interface QuestionTaskListItem {
  id: number,
  no: number,
  createdTime: number;
  expect: number, // 预期
  actual: number // 实际
}

/** 问答任务生成问题请求参数 */
export interface QuestionTaskApiParams {
  contentCateId: number;
  shopId: number;
  wordA: string[];
  wordB: string[];
  wordC: string[];
  wordD: string[];
}

/** 问答任务生成的问题列表 */
export interface QuestionListItem {
  id: number,
  question: string,
  answers: string[],
  tip: string
  wordTypes: string,
  questionType: string,
  words: string[],
  coreWords: string,
  /** 0 待审核，1 已通过，2 未通过 */
  status: 0 | 1 | 2 | 3 | 4,
  // 自用字段
  /** 判断当前问题是否修改 */
  isEdit?: boolean
  index?: number
  // [key: string]: any
}


/** 修改问题内容发送请求 */
export interface EditQuestion {
  id: number,
  title: string,
  answer: string[],
}