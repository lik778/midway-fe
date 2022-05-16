import { AuditStatus, ArticleSource, } from '@/enums';

export const COOKIE_TOKEN_KEY = '__t'
export const COOKIE_USER_KEY = '__u'
export const COOKIE_HASH_KEY = '__c'

// 打点的关键字 track
export const BXMAINSITE = 'bxmainsite'

export const auditStatusText: any = {
  [AuditStatus.DEFAULT]: '初始化',
  [AuditStatus.APPROVE]: '审核通过',
  [AuditStatus.REJECT]: '审核驳回',
  [AuditStatus.DELETED]: '已删除',
  [AuditStatus.VERIFY]: '审核中',
}

export const ArticleSourceText: any = {
  [ArticleSource.DEFAULT]: '默认',
  [ArticleSource.MAN_MADE]: '人工',
  [ArticleSource.BATCH]: '批量',
  [ArticleSource.AI]: 'AI',
}

// B2B模板
export const NEW_TEMPLATE_ID = 'f5760fe337070e8b9b8f3fdcd9ca1c32'
export const OLD_TEMPLATE_ID = '5fb387d2f2db3f6b8e7080e6'


