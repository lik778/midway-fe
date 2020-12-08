import { ContentCateType } from '@/enums';

export interface RouteParams {
  id: string;
}

export interface GetContentApiParams {
  page: number;
  size: number;
  contentCateId: number;
}

export interface CreateProductApiParams extends  CreateArticleApiParams {
  headImg?: string;
}

export interface CreateArticleApiParams {
  id?: number;
  contentCateId: number;
  content: string;
  contentImg?: string;
  name: string;
  price: number | string;
  shopId?: number;
  tags: string;
}

export interface DeleteApiParams {
  id: number;
}

export interface CateItem {
  id?: number;
  name: string;
  seoD?: string;
  seoK?: string;
  seoT?: string;
}

export interface CreateContentCateApiParams {
  id?: number;
  name: string;
  seoD: string;
  seoK: string;
  seoT: string;
  type: ContentCateType;
}
