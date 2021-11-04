export interface ServiceResponse<T> {
  code: number;
  data: T;
  success: boolean;
  message: string;
  requestId: string;
  timestamp: string;
  exception: string;
  exceptionClass: string;
}

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
export interface StatusChange {
  shopid: string,
  operationreason?: string,
}