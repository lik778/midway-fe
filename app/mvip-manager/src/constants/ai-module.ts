
import { CollectionStatus, AiTaskStatus, ZhidaoAiTaskQuestionStatus, ZhidaoAiTaskStatus, PostToolTitleKeys, CollectionFragmentsType } from '@/enums/ai-module'
import { DomainStatus } from '@/enums'


export const AiTaskStatusText: any = {
  [AiTaskStatus.ON_TASK]: '发文中',
  [AiTaskStatus.ON_PAUSE]: '已暂停',
  [AiTaskStatus.DONE]: '已发完',
  [AiTaskStatus.REJECT]: '审核驳回',
  [AiTaskStatus.DEFAULT]: '待审核',
  [AiTaskStatus.ON_SELECT]: '审核通过'
}

export const ZhidaoAiTaskStatusText: any = {
  [ZhidaoAiTaskStatus.ACTIVE]: '发文中',
  [ZhidaoAiTaskStatus.PAUSED]: '已暂停',
  [ZhidaoAiTaskStatus.ABORTED]: '已停止',
  [ZhidaoAiTaskStatus.DONE]: '已完成',
}

// ZhidaoAiTaskQuestionStatus
export const ZhidaoAiTaskQuestionStatusText: any = {
  [ZhidaoAiTaskQuestionStatus.WIATING]: '待发布',
  [ZhidaoAiTaskQuestionStatus.DONE]: '发布成功',
  [ZhidaoAiTaskQuestionStatus.REJECT]: '发布失败',
}

export const productText = (): any => {
  return {
    [DomainStatus.PREFIX]: {
      main: '产品',
      aiRecommond: '产品通用后缀'
    },
    [DomainStatus.SUFFIX]: {
      main: '服务',
      aiRecommond: '服务通用后缀'
    }
  }
}

// 素材包action
export const PAUSE_ACTION = 'pause'
export const AUDIT_ACTION = 'audit'
export const DRAFT_ACTION = 'draft'

export const collectionTranslateStatus = {
  [CollectionStatus.COLLECTION_FINISHED_STATUS]: { name: '推广完成', color: '#F4A74A' },
  [CollectionStatus.COLLECTION_PUBLISH_STATUS]: { name: '推广中', color: '#45C289' },
  [CollectionStatus.COLLECTION_PENDING_STATUS]: { name: '审核中', color: '#45C289' },
  [CollectionStatus.COLLECTION_REJECT_STATUS]: { name: '审核失败', color: '#F36961' },
  [CollectionStatus.COLLECTION_DRAFT_STATUS]: { name: '草稿', color: '' },
  [CollectionStatus.COLLECTION_ADVANCE_STATUS]: { name: '预创建', color: '' },
  [CollectionStatus.COLLECTION_DELETED_STATUS]: { name: '已删除', color: '' },
  [CollectionStatus.COLLECTION_PAUSED_STATUS]: { name: '已暂停', color: '' }
}

// 发帖数量限制
export const collectionText = {
  dailyPostLimit: '每天发帖数',
  postLimit: '最大发帖数'
}


export const wordsItemConfig: any = {
  wordA: {
    label: '地区',
    name: 'wordA',
    placeholder: '举例：\n浦东新区\n东方明珠\n南京西路',
    min: 6,
    max: 20,
    rules: '6-20个'
  },
  wordB: {
    label: '前缀',
    name: 'wordB',
    placeholder: '举例：\n专业的\n靠谱的',
    min: 10,
    max: 15,
    rules: '10-15个'
  },
  wordC: {
    label: '核心词',
    name: 'wordC',
    placeholder: '举例：\n冰箱维修\n气动隔膜泵',
    min: 3,
    max: 5,
    rules: '3-5个'
  },
  wordD: {
    label: '后缀',
    name: 'wordD',
    placeholder: '举例：\n电话\n厂家',
    min: 10,
    max: 15,
    rules: '10-15个'
  }
}

export const collectionFragmentsTypeMap = {
  [CollectionFragmentsType.COMPANY_INFO]: '公司介绍',
  [CollectionFragmentsType.QA_INFO]: '产品/服务介绍',
  [CollectionFragmentsType.COMPANY_INFO]: '小知识/问答',
}

export const PostToolTitleKeysMap = {
  [PostToolTitleKeys.CITY]: 'city',
  [PostToolTitleKeys.AREA]: 'area',
  [PostToolTitleKeys.PREFIX]: 'prefix',//"前置修饰词",
  [PostToolTitleKeys.MAIN]: 'main',//"主关键词",
  [PostToolTitleKeys.SUFFIX]: 'suffix',//"后置修饰词" ,
  [PostToolTitleKeys.SUB]: 'sub' //"副标题"
}