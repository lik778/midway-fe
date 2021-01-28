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
  [AiTaskStatus.REJECT]: '审核驳回',
  [AiTaskStatus.DEFAULT]: '待审核'
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
