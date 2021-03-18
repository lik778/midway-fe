import { getShopInfoApi, getShopListApi } from '@/api/shop';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Model } from 'dva';
import { cloneDeepWith, isNull, isNumber, isObject } from 'lodash'
import { ShopInfo } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';

interface ShopModelState {
  curShopInfo: ShopInfo | null;
  shopTotal: number | undefined;
  shopList: ShopInfo[] | null;
}

const defaultState: ShopModelState = {
  curShopInfo: null,
  shopTotal: 0,
  shopList: null
}

export const SHOP_NAMESPACE = 'shop'

// 店铺
export const GET_SHOP_LIST_ACTION = 'getShopListAction'
export const SET_SHOP_LIST_ACTION = 'setShopListAction'
export const GET_CUR_SHOP_INFO_ACTION = 'getCurShopInfoAction'
export const SET_CUR_SHOP_INFO_ACTION = 'setCurShopInfoAction'
export const GET_SHOP_TOTAL_ACTION = 'getShopTotalAction'
export const SET_SHOP_TOTAL_ACTION = 'setShopTotalAction'

export default <Model>{
  namespace: SHOP_NAMESPACE,
  state: cloneDeepWith(defaultState),
  effects: {
    [GET_CUR_SHOP_INFO_ACTION]: function * (action: AnyAction, effects: EffectsCommandMap) {
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
    [GET_SHOP_LIST_ACTION]: function * (action: AnyAction, effects: EffectsCommandMap) {
      const { put, select } = effects
      const shopModelState: ShopModelState = yield select((state: any) => state[SHOP_NAMESPACE])
      const { shopList, shopTotal } = shopModelState
      if (isNull(shopList)) {
        const { success, message, data} = yield getShopListApi()
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
    }
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
      return { ...state, shopList: [ ...action.payload ] };
    },
    [SET_SHOP_TOTAL_ACTION](state: ShopModelState, action: AnyAction) {
      return { ...state, shopTotal: action.payload };
    }
  }
}
