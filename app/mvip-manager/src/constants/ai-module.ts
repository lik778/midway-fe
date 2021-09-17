
import { COLLECTION_STATUS } from '@/enums/ai-module'
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