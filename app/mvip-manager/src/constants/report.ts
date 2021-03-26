import {
  PlatformType,
  BaxProductType,
  CateProductType,
  DisplayType, ReportProductType,
} from '@/enums/report';

export const PlatformLabelMap = {
  [PlatformType.BAI_DU]: '百度',
  [PlatformType.QI_HU]: '360',
  [PlatformType.SHEN_MA]: '神马',
  [PlatformType.SOU_GOU]: '搜狗',
}

export const BaxProductLabelMap = {
  [BaxProductType.FENG_MING]: '凤鸣广告',
  [BaxProductType.BIAO_WANG]: '标王广告',
  [BaxProductType.YI_HUI_TUI]: '易慧推广告',
}

export const CateProductLabelMap = {
  [CateProductType.POST]: '帖子',
  [CateProductType.QUESTION]: '问答',
  [CateProductType.SHOP]: '店铺'
}

export const DisplayLabelMap = {
  [DisplayType.PC]: '电脑端',
  [DisplayType.WAP]: '手机端',
}

export const ReportLinkMap: any = {
  [ReportProductType.CATE]: '/a/vip?src=datacenter',
  [ReportProductType.BIAOWANG]: '/a/quanwangtong?src=datacenter#four',
  [ReportProductType.FENGMING]: '/a/quanwangtong?src=datacenter#three',
  [ReportProductType.YIHUITUI]: '/a/yihuitui?src=datacenter'
}
