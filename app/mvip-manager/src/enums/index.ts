export enum ShopModuleType {
  PRODUCT = 'product',
  ARTICLE = 'article'
}

export enum ProductType {
  B2B = 'SALE',
  VIP = 'SERVICE'
}

export enum  IndursyModule {
  B2C_NORMAL='B2C行业通用模板',
  B2B_NORMAL = 'B2B行业通用模板',
  HUANGJIN= '黄金回收',
  BAOJIE='保洁服务',
  BAOMU='保姆月嫂',
  JIADIAN='家电维修',
  WULIU='物流'
}


export enum ShopBasisType {
  NAV = 'nav',
  CAROUSEL = 'carousel',
  CUSTOMER = 'customer',
  SEO = 'seo',
  INFO = 'info',
  MODULE = 'module-management',
  CONSULTATION = 'consultation-setting'
}

export enum ShopTDKType {
  INDEX = 'index',
  PRODUCT = 'product',
  ARTICLE = 'article',
  AREA = 'area',
  OPTIMIZATION = 'optimization'
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
  VERIFY,// 审核中
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

/** 后端服务控制器path */
export enum ServicePath {
  SHOP = '/management/api',
  ZHIDAO = '/zhidao/api',
  POST_TOOL = '/post-tool/api',
  REPORT = '/report/api',
  TRACKER = '/tracker'
}
