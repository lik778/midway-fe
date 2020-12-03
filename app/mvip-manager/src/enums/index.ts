export enum ShopModuleType {
  product = 'product',
  article = 'article'
}

export enum AuditStatus {
  DEFAULT, // 初始化
  APPROVE, // 审核通过
  REJECT , // 审核驳回
  DELETED, // 已删除
}

export enum ArticleSource {
  DEFAULT , // 默认
  MAN_MADE, // 人工
  BATCH, // 批量
  AI, // AI
}
