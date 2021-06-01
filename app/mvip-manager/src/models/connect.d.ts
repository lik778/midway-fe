import { AnyAction, Dispatch } from 'redux';
import { IRouteProps } from 'umi'
import { MenuDataItem, } from '@ant-design/pro-layout';
import { RouterTypes } from '@ant-design/pro-layout/lib/typings';
import { UserModelState } from './user';
import { ShopModelState } from './shop';
import { fromPairs } from 'lodash';

export { ShopModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    user: boolean;
    shop: boolean;
  };
}

export interface ConnectState {
  user: UserModelState; // 权限
  shop: ShopModelState;
  loading: Loading;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps extends Partial<IRouteProps> {
  dispatch?: Dispatch<AnyAction>;
}
