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
  num: number;
}


export interface NavItem{
  content: string;
  desc: string;
  display: number | undefined;
  id: number;
  isDisabled?: boolean
  key: string;
  name: string;
  position: string;
  maxLength?: number;
}

export interface ModifyNavItem{
  name: string;
  display: number | undefined;
  id: number;
}


export interface ImgItemParam{
  type: string;
  url: string;
}

export interface ImgDeleteParam{
  id: number;
}

export interface ImgListParam{
  page: number;
  size: number;
  status: number;
  type: number;
}

export interface CreateContentCateApiParams {
  id?: number;
  name: string;
  seoD: string;
  seoK: string;
  seoT: string;
  type: ContentCateType;
}


export interface TdkSaveMeta {
  description: string;
  keywords: string;
  position: number;
  title: string;
}

export interface TdkDetailMeta {
  position: number;
}

