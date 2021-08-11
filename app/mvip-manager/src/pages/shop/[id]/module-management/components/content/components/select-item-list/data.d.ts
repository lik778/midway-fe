import { ModuleComponentId } from '@/interfaces/shop'

import { SelectProductListItem, SelectArticleListItem } from '../components/select-item/data'
export interface Detail {
  name: string,
  productList?: SelectProductListItem[]
  articleList?: SelectArticleListItem[]
}

export interface RequestData {
  name: string,
  position: ModuleComponentId,
  productIdList?: number[]
  articleIdList?: number[]
}