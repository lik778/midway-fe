import { getProductListApi } from '@/api/shop'
import { ConfigItem } from './data'

export const selectItemConfig: {
  [key: string]: ConfigItem
} = {
  'home-swiper': {
    name: 'productList',
    label: '轮播产品',
    type: 'product',
    required: true,
    maxLength: 5,
    ajaxApi: getProductListApi as any,
    rules: [{ required: true, message: '请选择轮播产品' }]
  }
}