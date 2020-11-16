// todo: 这边需要添加一下res类
export interface RequestServiceInterface {
  get(url: string): string;
  post(url: string, params: any): any;
}

