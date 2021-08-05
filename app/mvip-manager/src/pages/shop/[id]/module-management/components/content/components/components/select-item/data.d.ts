import { ListRes } from '@/interfaces/base';

export type ConfigItemType = 'product' | 'article'

export enum ConfigItemTypeText {
  'product' = '产品',
  'article' = '文章'
}

export interface ConfigItem {
  name: string,// 表单项的key
  label: string,// 表单项文字
  type: ConfigItemType,// 列表是文章还是产品
  required: boolean,// 是否必填
  maxLength: number,// 做多添加
  ajaxApi: (...arg: any) => Promise<ListRes<any>>,// 请求列表的参数
  rules?: any[]// 校验规则
}

export interface SelectProductListItem {
  id: number,
  name: string,
  price: string,
  headImg: string,
  urlSuffix: string
  [key: string]: any
}

export interface SelectArticleListItem {
  id: number,
  name: string,
  urlSuffix: string
  [key: string]: any
}