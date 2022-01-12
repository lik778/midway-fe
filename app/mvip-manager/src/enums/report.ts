export enum PlatformType {
  BAI_DU = 1, // 百度
  SOU_GOU = 2, // 搜狗
  SHEN_MA = 3, // 神马
  QI_HU = 4, // 360
}

export enum BaxProductType {
  BIAO_WANG = 1, // 标王
  FENG_MING = 2, // 凤鸣
  YI_HUI_TUI = 3, // 易慧推广告
}

export enum CateProductType {
  SHOP = 4, // 店铺
  QUESTION= 5, // 问答
  POST = 6 // 帖子
}

export enum DisplayType {
  PC = 1,
  WAP = 2,
}

export enum ReportProductType {
  CATE = 'cate',
  BIAOWANG = 'biaowang',
  FENGMING = 'fengming',
  YIHUITUI = 'yihuitui'
}

export enum LeaveMessageChannelType {
  TIEZI = 'TIEZI',
  DIANPU = 'DIANPU',
  ZHIDAO = 'ZHIDAO',
  FENGMING = 'FENGMING',
  UNKNOWN = 'UNKNOWN',
  SHENGXIN = 'SHENGXIN'
}

// 留咨页面来源
export enum LeaveMessagePageFromEnum {
  // 公众号-留咨中心
  WECHAT = 'wechat',
  // 店铺 MVIP 后台-营销报表菜单栏
  MVIP = 'mvip',
  // 主站 VIP 后台-数据分析-核心统计-留咨入口
  MSVIP = 'msvip',
}
