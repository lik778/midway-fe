export enum ShopModuleType {
  PRODUCT = 'product',
  ARTICLE = 'article',
  IMAGESET = 'imageset'
}

export enum ProductType {
  B2B = 'SALE',
  VIP = 'SERVICE'
}


export enum ShopBasisType {
  NAV = 'nav',
  CAROUSEL = 'carousel',
  CUSTOMER = 'customer',
  SEO = 'seo',
  INFO = 'info',
}

export enum ShopTDKType {
  INDEX = 'index',
  PRODUCT = 'product',
  ARTICLE = 'article'
}

export enum ShopTDKPosition {
  INDEX = "homePage",
  PRODUCT = "productListPage",
  ARTICLE = "articleListPage"
}

export enum AuditStatus {
  DEFAULT, // 初始化
  APPROVE, // 审核通过
  REJECT, // 审核驳回
  DELETED, // 已删除
}

export enum ArticleSource {
  DEFAULT, // 默认
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

export enum ZhidaoAiTaskQuestionStatus {
  WIATING = 0, // 待发送
  DONE = 1, // 发送成功
  REJECT = 2, // 发送失败
}

export enum AiTaskStatus {
  ON_TASK = 0, // 发文中
  ON_PAUSE = 1, // 已暂停
  DONE = 2, // 已发完
  REJECT = 3, // 审核驳回
  DEFAULT = 4, // 待审核
  ON_SELECT = 5 //待用户选词
}

export enum DeviceType {
  PC = 1,
  WAP = 2,
}

export enum PositionType {
  HOME = 1,
  CONTENT = 3,
}

export enum DomainStatus {
  PREFIX = "PREFIX", // 前缀
  SUFFIX = "SUFFIX", // 后缀
  CUSTOM = "CUSTOM" // 自定义
}

/** 店铺的行业属性 */
export enum ShopIndustryType {
  SERVICE = "SERVICE", // 服务
  SALE = "SALE", // 产品
}

export enum KFStatus {
  CLOSE = 'CLOSE',
  OPEN = 'OPEN'
}

export enum AiTaskAction {
  START = 'start',
  PAUSE = 'pause'
}

/** 后端服务控制器path */
export enum ServicePath {
  SHOP = '/management/api',
  ZHIDAO = '/zhidao/api',
  REPORT = '/report/api'
}


/** 问答AI任务状态 */
export enum ZhidaoAiTaskStatus {
  /**
     * 任务启动中
     */
  ACTIVE = 'ACTIVE',
  /**
   * 任务暂停中
   */
  PAUSED = 'PAUSED',
  /**
   * 任务异常终止
   */
  ABORTED = 'ABORTED',
  /**
   * 任务已完成
   */
  DONE = 'DONE'
}
