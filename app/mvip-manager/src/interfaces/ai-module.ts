import { CateItem } from '@/interfaces/shop';
import { AiTaskStatus, ZhidaoAiTaskQuestionStatus, ZhidaoAiTaskStatus, CollectionStatus, PostToolTitleKeys, CollectionAction, CollectionFragmentsType } from '@/enums/ai-module';
import { PostToolTitleKeysMap } from '@/constants/ai-module'
import { ShopMetas } from '@/interfaces/user'
export interface AiTaskApiParams {
  contentCateId: number;
  shopId: number;
  wordA: string[];
  wordB: string[];
  wordC: string[];
  wordD: string[];
  wordId: number,
}

export interface AiShopList {
  id: number;
  name: string;
  articleCates: CateItem[];
  isSupportAi: boolean;
  type: number
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
  wordId?: number
}

/** 优选词 **/
export interface ChooseWord {
  id: number,
  seoWord: string,
  type: string
}
/** 优选词列表 **/
export interface ChooseWordList {
  wordsGrouped: {
    AC: ChooseWord[],
    ABC: ChooseWord[],
    ACD: ChooseWord[],
    ABCD: ChooseWord[],
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

/** 问答任务生成知道请求参数 */
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
  wordId: number
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
  status: ZhidaoAiTaskStatus,
  memo: string
  wordId?: number
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
  status: ZhidaoAiTaskQuestionStatus,// 缺少
  url: string // 字符串
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


/** 发帖通开始 */
// 素材包列表
export interface CollectionListItem {
  adsSuccess: number
  adsTotal: number
  categoryId: string
  categoryName: string
  createTime: number
  dailyPostLimit: number
  hasRichContent: true
  id: number
  message: string
  metas?: { [key: string]: string }
  modifiedTime: number
  name: string
  postLimit: number
  status: CollectionStatus
  wordId?: number
}

export interface CollectionDetailthirdMeta {
  id: string,
  name: string
}

// 素材包详情
export interface CollectionDetail extends CollectionListItem {
  thirdMeta: CollectionDetailthirdMeta[]
}

export interface InitCollectionForm {
  name: string,
  metas: ShopMetas,
}

// 更新素材包详情
export interface UpdataCollectionParams {
  action?: CollectionAction,
  categoryId: string, // 一级类目
  dailyPostLimit?: number,
  metas?: { [key: string]: string },
  name: string,
  postLimit?: number,
  thirdMetaIds: string
  wordId?: number
}


// 创建标题 
export interface CollectionPreviewTitleParmas {
  cityNum: number,
  groupWords: Partial<{
    [key in PostToolTitleKeys]: string[]
  }>
}

export interface CollectionTitleListItem {
  areaName: string,
  cityName: string,
  city_id: string,
  content: string,
  coreWord: string,
  modal: string,
  prefix: string,
  suffix: string
}

export interface CollectionPreviewTitleListItem {
  id: number
  city_id: string
  content: string
  status: string
}

export interface CollectionCreateTitleParmas extends CollectionTitleListItem {
  city_id: string,
}

// 获取以填充的图片列表
export interface CollectionImageListItem {
  id: number,
  content: string,
  status: string
}

/** 发帖通生成标题字段 */
export interface CollectionTitleApiParams {
  /** 城市 */
  city: string[];
  /** 地区 */
  area: string[];
  /** 前缀 */
  prefix: string[];
  /** 核心词 */
  main: string[];
  /** 后缀 */
  suffix: string[];
}

export interface CollectionCityListItem {
  id: string,
  name: string,
  areas: string[]
}


export interface UserVipResourcesListItem {
  name: string,
  productLine: number,
  productLineName: string,
  productLineValue: string,
  vipType: number,
  vipTypeName: string,
  vipTypeValue: string,
}

export interface SecondCategoriesListItem {
  value: string,
  name: string
}

export interface ImgWholeUrlParmas {
  suffix: '_bi' // 图片格式
  images: string[]
}

export interface FragmentsListItem {
  content: string
  id: number,
  label: string
  status: string
  type: CollectionFragmentsType
}


export interface MaterialListItem {
  content: string
  id: string
  tags: string[]
  title: string,
  [key: string]: any
}

export interface CompanyMeta {
  controlType: string
  maxlength: string
  name: string
  readonly: boolean
  remember: string
  required: boolean
  tips: string
  type: string
  value: string
}

export interface CompanyInfo {
  isUserPerfect: boolean, // 这个是商户后台的企业资料是否填写
  // 下面是老发帖通的资料
  contact: string,
  contactName: string,
  qq: string,
  weixin: string,
  address: string
  maxOldTaskId: number // 老发帖通最大的id 用户判断老发帖通是否有进行中的任务
}

export type AuthKey = 'SHOP' | 'ZHIDAO' | 'POSTTOOL'

export interface SaveWordParmes {
  "aiSource": 'shop' | 'zhidao' | 'posttool',
  "city": string[],
  "area": string[],
  "coreWords": string[],
  "firstCategoryId": string,
  "modal": string[],
  "prefix": string[],
  "secondCategoryId": string,
  "subTitle": string[],
  "suffix": string[],
  "thirdCategoryId": string
}