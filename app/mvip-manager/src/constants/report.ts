import {
  SearchEngineType,
  BaxProductType,
  CateProductType,
  DisplayType,
} from '@/enums/report';

export const SearchEngineLabelMap = {
  [SearchEngineType.BAIDU]: '百度',
  [SearchEngineType.SANLIULING]: '360',
  [SearchEngineType.SHENMA]: '神马',
  [SearchEngineType.SOUGOU]: '搜狗',
}

export const BaxProductLabelMap = {
  [BaxProductType.FENG_MING]: '凤鸣',
  [BaxProductType.BIAO_WANG]: '标王',
  [BaxProductType.QIAN_CI]: '易慧推',
}

export const CateProductLabelMap = {
  [CateProductType.TIE_ZI]: '帖子',
  [CateProductType.WEN_DA]: '问答',
  [CateProductType.DIAN_PU_ARTICLE]: '店铺文章',
  [CateProductType.DIAN_PU_PRODUCT]: '店铺产品',
}

export const DisplayLabelMap = {
  [DisplayType.PC]: '电脑端',
  [DisplayType.MOBILE]: '手机端',
}
