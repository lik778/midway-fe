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
  result: T;
  totalPage: number;
  totalRecord: number;
  pageSize: number;
}

export interface BaseProps {
  dispacth?: Dispatch<any>;
  history?: History;
}
