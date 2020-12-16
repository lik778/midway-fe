export enum ShopModuleType {
  PRODUCT = 'product',
  ARTICLE = 'article'
}

export enum ShopBasisType {
  NAV = 'nav',
  CAROUSEL = 'carousel',
  SEO = 'seo'
}

export enum ShopTDKType {
  INDEX = 'index',
  PRODUCT = 'product',
  ARTICLE = 'article'
}

export enum ShopTDKPosition {
  INDEX = 1,
  PRODUCT = 2,
  ARTICLE = 3
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

export enum ContentCateType {
  PRODUCT = 1, // 产品分类
  ARTICLE = 2 // 文章分类
}

export enum VerifyType {
  LICENCE = 'LICENCE', // 营业执照
  IDCARD = 'IDCARD', // 身份证
}

export enum VerifyStatus {
  DEFAULT = '',
  PENDING = 'PENDING',
  ACCEPT = 'ACCEPT',
  REFUSE = 'REFUSE',
  REVOKE = 'REVOKE'
}

export enum AiTaskStatus {
  ON_TASK, // 发文中
  ON_PAUSE, // 已暂停
  DONE // 已发完
}

export enum  DeviceType{
  PC = 1,
  WAP = 2,
}

export enum DomainStatus {
  PREFIX = "PREFIX", // 前缀
  SUFFIX = "SUFFIX", // 后缀
  CUSTOM = "CUSTOM" // 自定义
}