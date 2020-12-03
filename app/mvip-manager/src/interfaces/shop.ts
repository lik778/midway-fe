import { ContentCateType } from '@/enums';

export interface RouteParams {
  id: string;
}

export interface getContentApiParams {
  page: number;
  size: number;
  contentCateId: number;
}

export interface deleteProductApiParams {
  id: number;
}

export interface CateItem {
  id: number;
  name: string;
  seoD?: string;
  seoK?: string;
  seoT?: string;
}

export interface createContentCateApiParams {
  id?: number;
  name: string;
  seoD: string;
  seoK: string;
  seoT: string;
  type: ContentCateType;
}
