import { DomainStatus } from './site';

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
  shopId?: number;
}

// tips: 请求midway-service的头部参数
export interface HeaderAuthParams {
  'x-api-hash': string;
  'x-api-user': string;
  'x-api-token': string;
  'x-api-src': string;
  'x-api-shop-id'?: number;
  'content-type': string;
}

export interface PageHeaderParams {
  'x-api-shop-name': string;
  'x-api-device': string;
  'x-api-domain-type': DomainStatus;
}

// 店铺落地页请求返回
export interface ServiceResponse<T> {
  code: number;
  data: T;
  message: string;
  requestId: string;
  success?: boolean;
  timestamp: string;
  exception: string;
  exceptionClass: string;
}

export interface ShopComponents {
  about?: any; // 公司介绍
  contact?: any; // 联系我们
  productRecommend?: any; // 服务推荐
  articleRecommend?: any; // 文章推荐
  productCateList?: any; // 服务分类列表
  articleCateList?: any; // 文章分类列表
  productList?: any; // 服务列表
  articleList?: any; // 文章列表
  productInfo?: any; // 服务详情
  articleInfo?: any; // 文章详情
  navigation?: any; // 导航
  footerLink?: any; // 友链
  basic?: any; // 用户信息
  shopInfo?: any; // 店铺信息
  bread?: any; // 面包屑
  meta?: any; // seo tkd
}
