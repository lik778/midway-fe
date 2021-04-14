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

/** 优选词列表 **/
export interface ChooseWord {
  wordsGrouped: {
    AC: {
      id: number,
      seoWord: string,
      type: string
    }[],
    ABC: {
      id: number,
      seoWord: string,
      type: string
    }[],
    ACD: {
      id: number,
      seoWord: string,
      type: string
    }[],
    ABCD: {
      id: number,
      seoWord: string,
      type: string
    }[],
  }
}
/** 疑问词具体字符列表 */
export interface InterrogativeChildListItem {
  id: number,
  content: string
}

/** 疑问词大类接口返回的vo */
export interface InterrogativeDataVo {
  [key: string]: {
    [key: string]: string
  }
}


/** 疑问词大类列表 */
export interface InterrogativeListItem {
  id: number,
  name: string,
  child: InterrogativeChildListItem[],

  // 自用字段
  isSelect?: boolean
}

/** 问答任务生成问答请求参数 */
export interface QuestionTaskApiParams {
  /** 地区 */
  area: string[];
  /** 核心词 */
  coreWords: string[];
  /** 辅助词 */
  modal: string[];
  /** 前缀 */
  prefix: string[];
  /** 疑问词 */
  suffix: string[];
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
  /** 判断当前问答是否修改 */
  isEdit?: boolean
  index?: number
}


/** 修改问答内容发送请求 */
export interface EditQuestion {
  questionId: number
  /** 修改答案需传（答案的序号） */
  answerId?: number,
  content: string,
}

export interface BasicMaterialForm {
  wordA: string;
  wordB: string;
  wordC: string;
  wordD: string;
  wordE: string;
}


/** 接口获取基础素材库内容 */
export interface BasicMaterialDataItem {
  id: number,
  usrId: number,
  content: string,
  type: number,
  questionTypes: number,
  useNum: number,
  created_time: number,
  modified_time: number
}

/** 基础素材库提交 */
export type BasicMaterialApiParams = {
  type: number,
  content: string[]
}[]

/** 页面当前状态 */

// SHOW_CREATE
//     SHOW_QA_LIST
//     CREATE_WAITING
//     USER_PROFILE
//     USER_MATERIAL
export type CreateQuestionTaskPageStatus = 'SHOW_CREATE' | 'CREATE_WAITING' | 'SHOW_QA_LIST'

/** 获取创建页面基础数据 */
export interface CreateQuestionTaskBasicData {
  /** 是否允许创建任务 */
  canCreateTask: boolean
  /** 是否强制通知禁止关闭弹窗 */
  forceNotice: boolean | null
  /** 弹窗建议跳转的页面
   * @type SHOW_CREATE 显示创建页面
   * @type SHOW_QA_LIST 显示问答包列表
   * @type CREATE_WAITING 是否在等待生成
   * @type USER_PROFILE 提示用户是否需要跳转企业基础信息信息（强制）
   * @type USER_MATERIAL 提示用户是否需要跳转补充素材（强制）
   */
  nextAction: 'SHOW_CREATE' | 'SHOW_QA_LIST' | 'CREATE_WAITING' | 'USER_PROFILE' | 'USER_MATERIAL' | null
  /** 弹窗提示文本 */
  notice: string | null
  /** 疑问词列表 */
  suggestSuffix: InterrogativeDataVo | null
}

export interface GetQuotaNumRes {
  limit: number,// quota总数
  remain: number,//
  dailyLimit: number,// 每日使用次数上线
  dailyRemain: number,//
  aiLimit: number,// AI发布上限
  aiRemain: number,// AI剩余发布数
}
