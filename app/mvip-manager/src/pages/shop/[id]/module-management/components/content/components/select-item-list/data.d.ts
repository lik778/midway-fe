import { ComponentId } from '../../../../data';
import { SelectProductListItem, SelectArticleListItem } from '../components/select-item/data'
export interface Detail {
  name: string,
  productList?: SelectProductListItem[]
  articleList?: SelectArticleListItem[]
}

export interface RequestData {
  name: string,
  position: ComponentId,
  productIdList?: number[]
  articleIdList?: number[]
}