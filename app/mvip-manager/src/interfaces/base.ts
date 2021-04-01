import { Dispatch } from 'dva';

export interface CascaderOption {
  value: string | number;
  label: React.ReactNode;
  disabled: boolean;
  children?: CascaderOption[];
}

export interface PageParams {
  size: number;
  page: number;
}

export interface ListRes<T> {
  result: T | null;
  totalPage: number;
  totalRecord: number | null;
  /** 有部分接口没有返回这个pageSize,所以注释掉 */
  // pageSize: number;
}

export interface BaseProps {
  dispacth?: Dispatch<any>;
  history?: History;
}
