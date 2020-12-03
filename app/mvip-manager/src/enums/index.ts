export enum ShopModuleType {
  product = 'product',
  article = 'article'
}

export enum AuditStatus {
  DEFAULT = 0, // 初始化
  APPROVE = 1, // 审核通过
  REJECT = 2, // 审核驳回
  DELETED = 3, // 已删除
}
