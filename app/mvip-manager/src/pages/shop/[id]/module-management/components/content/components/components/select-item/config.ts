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
    maxLength: 12,
    extraTips: '建议添加6个产品页面美观度较佳',
    ajaxApi: getProductListApi as any,
    rules: [{ required: true, message: '请选择热门产品' }]
  },
  'homePage-articleList': {
    name: 'articleList',
    label: '新闻资讯',
    type: 'article',
    required: true,
    maxLength: 4,
    ajaxApi: getArticleListApi as any,
    rules: [{ required: true, message: '请选择文章' }]
  },
  'productListPage-productRecommend': {
    name: 'productList',
    label: '产品推荐',
    type: 'product',
    required: true,
    maxLength: 6,
    ajaxApi: getProductListApi as any,
    rules: [{ required: true, message: '请选择产品' }]
  },
  'productListPage-articleRecommend': {
    name: 'articleList',
    label: '文章推荐',
    type: 'article',
    required: true,
    maxLength: 9,
    ajaxApi: getArticleListApi as any,
    rules: [{ required: true, message: '请选择文章' }]
  },
  'articleListPage-productRecommend': {
    name: 'productList',
    label: '产品推荐',
    type: 'product',
    required: true,
    maxLength: 6,
    ajaxApi: getProductListApi as any,
    rules: [{ required: true, message: '请选择产品' }]
  },
  'articleInfoPage-productRecommend': {
    name: 'productList',
    label: '产品推荐',
    type: 'product',
    required: true,
    maxLength: 6,
    ajaxApi: getProductListApi as any,
    rules: [{ required: true, message: '请选择产品' }]
  },
  'articleInfoPage-articleRecommend': {
    name: 'articleList',
    label: '文章推荐',
    type: 'article',
    required: true,
    maxLength: 9,
    ajaxApi: getArticleListApi as any,
    rules: [{ required: true, message: '请选择文章' }]
  },
  'productInfoPage-productRecommend': {
    name: 'productList',
    label: '产品推荐',
    type: 'product',
    required: true,
    maxLength: 5,
    ajaxApi: getProductListApi as any,
    rules: [{ required: true, message: '请选择产品' }]
  },
}