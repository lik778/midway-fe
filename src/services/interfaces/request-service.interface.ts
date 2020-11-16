// todo: 这边需要添加一下res类
export interface RequestServiceInterface {
  get(url: string, query: any): Promise<any>;
  post(url: string, body: any): Promise<any>;
}

