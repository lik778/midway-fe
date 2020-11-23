export interface CommonRes {
  code: number;
  success: boolean;
  message: string;
}

// tips: 前端请求的需要的参数
export interface ManagementReqParams {
  method: string;
  path: string;
  params?: any;
}

// tips: 请求midway-service的头部参数
export interface HeaderAuthParams {
  'X-Api-Hash': string;
  'X-Api-User': string;
  'X-Api-Token': string;
  'X-Api-Src': string;
  'Content-Type': string;
}
