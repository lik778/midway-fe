import { AuditStatus, ArticleSource, } from '@/enums';

export const COOKIE_TOKEN_KEY = '__t'
export const COOKIE_USER_KEY = '__u'
export const COOKIE_HASH_KEY = '__c'


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


