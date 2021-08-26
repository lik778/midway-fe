import { MediaItem } from '@/components/img-upload/data';
import { SelectProductListItem } from '../../../../../components/select-item/data'


export interface Detail {
  backGroundImg: string,
  productList: SelectProductListItem[]
}

export interface InitDetail {
  productList: SelectProductListItem[]
  backGroundImg: MediaItem | '',
}