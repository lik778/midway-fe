export interface PageParams {
  size: number;
  page: number;
}

export interface ListRes<T> {
  result: T;
  totalPage: number;
  totalRecord: number;
  pageSize: number;
}
