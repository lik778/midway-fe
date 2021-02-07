import {
  PlatformType,
  BaxProductType,
  CateProductType,
  DisplayType,
} from '@/enums/report';

export const SearchEngineLabelMap = {
  [PlatformType.BAI_DU]: '百度',
  [PlatformType.QI_HU]: '360',
  [PlatformType.SHEN_MA]: '神马',
  [PlatformType.SOU_GOU]: '搜狗',
}

export const BaxProductLabelMap = {
  [BaxProductType.FENG_MING]: '凤鸣',
  [BaxProductType.BIAO_WANG]: '标王',
  [BaxProductType.YI_HUI_TUI]: '易慧推',
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
