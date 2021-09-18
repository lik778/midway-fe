
import { COLLECTION_STATUS, AiTaskStatus, ZhidaoAiTaskQuestionStatus, ZhidaoAiTaskStatus } from '@/enums/ai-module'
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
  [COLLECTION_STATUS.COLLECTION_FINISHED_STATUS]: { name: '推广完成', color: '#F4A74A' },
  [COLLECTION_STATUS.COLLECTION_PUBLISH_STATUS]: { name: '推广中', color: '#45C289' },
  [COLLECTION_STATUS.COLLECTION_PENDING_STATUS]: { name: '审核中', color: '#45C289' },
  [COLLECTION_STATUS.COLLECTION_REJECT_STATUS]: { name: '审核失败', color: '#F36961' },
  [COLLECTION_STATUS.COLLECTION_DRAFT_STATUS]: { name: '草稿', color: '' },
  [COLLECTION_STATUS.COLLECTION_ADVANCE_STATUS]: { name: '预创建', color: '' },
  [COLLECTION_STATUS.COLLECTION_DELETED_STATUS]: { name: '已删除', color: '' },
  [COLLECTION_STATUS.COLLECTION_PAUSED_STATUS]: { name: '已暂停', color: '' }
}

// 发帖数量限制
export const collectionText = {
  dailyPostLimit: '每天发帖数',
  postLimit: '最大发帖数'
}

