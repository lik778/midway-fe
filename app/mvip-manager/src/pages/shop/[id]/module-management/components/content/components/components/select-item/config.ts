import { getProductListApi } from '@/api/shop'
import { ConfigItem } from './data'

export const selectItemConfig: {
  [key: string]: ConfigItem
} = {
  'home-swiper': {
    name: 'productIds',
    label: '轮播产品',
    btnText: '添加产品',
    tip: '（最多可添加5个产品）',
    required: true,
    maxLength: 5,
    ajaxApi: getProductListApi,
    rules: [{ required: true, message: '请选择轮播产品' }]
  }
}