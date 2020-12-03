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
}
