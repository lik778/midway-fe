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



/** 问答任务生成问题请求参数 */
export interface QuestionTaskApiParams {
  contentCateId: number;
  shopId: number;
  wordA: string[];
  wordB: string[];
  wordC: string[];
  wordD: string[];
}

/** 问答任务列表 */
export interface QuestionTaskListItem {
  /** 任务id 同时也是编号 */
  taskId: number,
  /** 已发布数量 */
  publishedNum: number,
  /** 预期发布数量 */
  expectNum: number,
  createdTime: number,
}

/** 问答任务详情（问答包列表） */
export interface QuestionListItem {
  id: number,
  question: string,
  answers: string[],
  /** 被驳回时的提示文本 */
  tip: string,// 缺少
  wordTypes: string,
  questionType: string,
  words: string[],
  coreWords: string,
  /** 问答题目状态 */
  status: 0 | 1 | 2 | 3 | 4,// 缺少

  // 自用字段
  /** 判断当前问题是否修改 */
  isEdit?: boolean
  index?: number
}


/** 修改问题内容发送请求 */
export interface EditQuestion {
  questionId: number
  /** 修改答案需传（答案的序号） */
  answerId?: number,
  content: string,
}

/** 基础素材库提交 */
export interface BasicMaterialApiParams {
  /**  */
  wordA: string[],
  wordB: string[],
  wordC: string[],
  wordD: string[],
  wordE: string[],
}