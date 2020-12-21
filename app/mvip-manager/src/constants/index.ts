import { AuditStatus, ArticleSource, AiTaskStatus, DomainStatus } from '@/enums';

export const auditStatusText: any = {
  [AuditStatus.DEFAULT]: '初始化',
  [AuditStatus.APPROVE]: '审核通过',
  [AuditStatus.REJECT]: '审核驳回',
  [AuditStatus.DELETED]: '已删除',
}

export const ArticleSourceText: any = {
  [ArticleSource.DEFAULT]: '默认',
  [ArticleSource.MAN_MADE]: '人工',
  [ArticleSource.BATCH]: '批量',
  [ArticleSource.AI]: 'AI',
}

export const AiTaskStatusText: any = {
  [AiTaskStatus.ON_TASK]: '发文中',
  [AiTaskStatus.ON_PAUSE]: '已暂停',
  [AiTaskStatus.DONE]: '已发完',
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
