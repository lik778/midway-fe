// todo: 这边需要添加一下res类
export interface ApiServiceInterface {
  host: string;
  path: string;
  get(path: string): string;
  post(path: string, params: any): any;
}

