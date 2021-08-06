import { getProductListApi, getArticleListApi } from '@/api/shop'
import { ConfigItem, ConfigKey } from './data'

export const selectItemConfig: {
  [key in ConfigKey]: ConfigItem
} = {
  'homePage-banner': {
    name: 'productList',
    label: '轮播产品',
    type: 'product',
    required: true,
    maxLength: 5,
    ajaxApi: getProductListApi as any,
    rules: [{ required: true, message: '请选择轮播产品' }]
  },
  'homePage-productRecommend': {
    name: 'productList',
    label: '热门产品',
    type: 'product',
    required: true,
    maxLength: 8,
    ajaxApi: getProductListApi as any,
    rules: [{ required: true, message: '请选择热门产品' }]
  },
  'productListPage-articleRecommend': {
    name: 'articleList',
    label: '文章推荐',
    type: 'article',
    required: true,
    maxLength: 8,
    ajaxApi: getArticleListApi as any,
    rules: [{ required: true, message: '请选择热门产品' }]
  }
}