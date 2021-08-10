import { getShopInfoApi, getShopListApi, getCreateShopStatusApi } from '@/api/shop';
import { AnyAction } from 'redux';
import { Dispatch, EffectsCommandMap, Model } from 'dva';
import { cloneDeepWith, isNull, isNumber, isObject } from 'lodash'
import { ShopInfo, ShopStatus } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';
import { getFullAction } from '@/utils/model'

export interface ShopModelState {
  curShopInfo: ShopInfo | null;
  shopTotal: number | undefined;
  shopList: ShopInfo[] | null;
  shopStatus: ShopStatus | null
}

const defaultState: ShopModelState = {
  curShopInfo: null,
  shopTotal: 0,
  shopList: null,
  shopStatus: {} as ShopStatus
}

export const SHOP_NAMESPACE = 'shop'

// 店铺
export const GET_SHOP_LIST_ACTION = 'getShopListAction'
export const SET_SHOP_LIST_ACTION = 'setShopListAction'
export const GET_CUR_SHOP_INFO_ACTION = 'getCurShopInfoAction'
export const SET_CUR_SHOP_INFO_ACTION = 'setCurShopInfoAction'
export const GET_SHOP_TOTAL_ACTION = 'getShopTotalAction'
export const SET_SHOP_TOTAL_ACTION = 'setShopTotalAction'
export const GET_SHOP_STATUS_ACTION = 'getShopStatusAction'
export const SET_SHOP_STATUS_ACTION = 'setShopStatusAction'

export const shopMapStateToProps = (state: any): any => {
  const { curShopInfo, shopTotal, shopList, shopStatus } = state[SHOP_NAMESPACE];
  return { curShopInfo, shopTotal, shopList, shopStatus }
}

export const shopMapDispatchToProps = (dispatch: Dispatch): any => {
  return {
    getShopStatus: () => dispatch({ type: getFullAction(SHOP_NAMESPACE, GET_SHOP_STATUS_ACTION) }),
    setShopStatus: (payload: ShopStatus) => dispatch({ type: getFullAction(SHOP_NAMESPACE, SET_SHOP_STATUS_ACTION), payload }),
    getShopList: (data?: { reloadList?: boolean }) => dispatch({ type: getFullAction(SHOP_NAMESPACE, GET_SHOP_LIST_ACTION), data: data || {} }),
    setShopList: (payload: ShopInfo[]) => dispatch({ type: getFullAction(SHOP_NAMESPACE, SET_SHOP_LIST_ACTION), payload }),
    setCurShopInfo: (shopInfo: ShopInfo) => dispatch({ type: getFullAction(SHOP_NAMESPACE, SET_CUR_SHOP_INFO_ACTION), payload: shopInfo }),
    getCurShopInfo: () => dispatch({ type: getFullAction(SHOP_NAMESPACE, GET_CUR_SHOP_INFO_ACTION) }),
    getShopTotal: () => dispatch({ type: getFullAction(SHOP_NAMESPACE, GET_SHOP_TOTAL_ACTION) }),
    setShopTotal: (payload: number) => dispatch({ type: getFullAction(SHOP_NAMESPACE, SET_SHOP_TOTAL_ACTION), payload })
  }
}

export default <Model>{
  namespace: SHOP_NAMESPACE,
  state: cloneDeepWith(defaultState),
  effects: {
    [GET_CUR_SHOP_INFO_ACTION]: function* (action: AnyAction, effects: EffectsCommandMap) {
      const { put, select } = effects
      const shopList: ShopInfo[] | null = yield select((state: any) => state[SHOP_NAMESPACE].shopList)
      if (isNull(shopList)) {
        const { success, message, data } = yield getShopInfoApi(action.id)
        if (success) {
          yield put({ type: SET_CUR_SHOP_INFO_ACTION, payload: data })
        } else {
          errorMessage(message)
        }
      }
    },
    [GET_SHOP_LIST_ACTION]: function* (action: AnyAction, effects: EffectsCommandMap) {
      const { put, select } = effects
      const shopModelState: ShopModelState = yield select((state: any) => state[SHOP_NAMESPACE])
      const { shopList, shopTotal } = shopModelState
      if (isNull(shopList) || action?.data?.reloadList) {
        const { success, message, data } = yield getShopListApi()
        if (success) {
          yield put({ type: SET_SHOP_LIST_ACTION, payload: data.result })
          yield put({ type: SET_SHOP_TOTAL_ACTION, payload: data.totalRecord })
        } else {
          errorMessage(message)
        }
      } else {
        yield put({ type: SET_SHOP_LIST_ACTION, payload: shopList })
        yield put({ type: SET_SHOP_TOTAL_ACTION, payload: shopTotal })
      }
    },
    [GET_SHOP_STATUS_ACTION]: function* (action: AnyAction, effects: EffectsCommandMap) {
      const { put } = effects
      const { success, message, data } = yield getCreateShopStatusApi()
      if (success) {
        yield put({ type: SET_SHOP_STATUS_ACTION, payload: data })
      } else {
        errorMessage(message)
      }
    },
  },
  reducers: {
    [SET_CUR_SHOP_INFO_ACTION](state: ShopModelState, action: AnyAction) {
      let curShopInfo = null
      const { payload } = action
      if (isNumber(payload)) {
        curShopInfo = state.shopList && state.shopList.find(x => x.id === payload);
      } else if (isObject(payload)) {
        curShopInfo = action.payload
      }
      return { ...state, curShopInfo: cloneDeepWith(curShopInfo) };
    },
    [SET_SHOP_LIST_ACTION](state: ShopModelState, action: AnyAction) {
      return { ...state, shopList: [...action.payload] };
    },
    [SET_SHOP_TOTAL_ACTION](state: ShopModelState, action: AnyAction) {
      return { ...state, shopTotal: action.payload };
    },
    [SET_SHOP_STATUS_ACTION](state: ShopModelState, action: AnyAction) {
      return { ...state, shopStatus: action.payload };
    }
  }
}
