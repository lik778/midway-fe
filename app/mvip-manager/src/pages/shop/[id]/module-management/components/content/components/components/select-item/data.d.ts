import { ListRes } from '@/interfaces/base';
import { ServiceResponse } from '@/interfaces/api';

import {
  ArticleListItem, GetContentApiParams, ProductListItem,
} from '@/interfaces/shop';

export type ConfigItemType = 'product' | 'article'

export enum ConfigItemTypeText {
  'product' = '产品',
  'article' = '文章'
}

export type ConfigKey = 'homePage-banner' | 'homePage-productRecommend' | 'productListPage-productRecommend' | 'productListPage-articleRecommend' | 'articleListPage-productRecommend' | 'articleInfoPage-productRecommend' | 'articleInfoPage-articleRecommend'

export interface ConfigItem {
  name: string,// 表单项的key
  label: string,// 表单项文字
  type: ConfigItemType,// 列表是文章还是产品
  required: boolean,// 是否必填
  maxLength: number,// 做多添加
  ajaxApi: (shopId: number, params: GetContentApiParams) => Promise<ServiceResponse<{
    productList: ListRes<ProductListItem[]>,
    articleList: ListRes<ArticleListItem[]>,
  }>>,// 请求列表的参数
  rules?: any[]// 校验规则
}

export interface SelectProductListItem {
  id: number,
  name: string,
  price: string,
  headImg: string,
  urlSuffix: string
  createdTime: number,
  [key: string]: any
}

export interface SelectArticleListItem {
  id: number,
  name: string,
  createdTime: number,
  urlSuffix: string
  [key: string]: any
}