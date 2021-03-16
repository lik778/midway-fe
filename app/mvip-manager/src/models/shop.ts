import { getShopInfoApi } from '@/api/shop';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Model } from 'dva';
import { cloneDeepWith } from 'lodash'
import { ShopInfo } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';

interface ShopModelState {
  shopInfo: ShopInfo | null;
  curShopInfo: ShopInfo | null;
  shopInfoMap: Map<number, ShopInfo>;
}

const defaultState: ShopModelState = {
  shopInfo: null,
  curShopInfo: null,
  shopInfoMap: new Map()
}

export const SHOP_NAMESPACE = 'shop'
export const SET_SHOP_INFO_ACTION = 'setShopInfoAction'
export const SET_SHOP_INFO_MAP_ACTION = 'setShopInfoMapAction'
export const GET_SHOP_INFO_ACTION = 'getShopInfoAction'

export const SET_CUR_SHOP_INFO_ACTION = 'getCurShopInfoAction'
export const GET_CUR_SHOP_INFO_ACTION = 'getCurShopInfoAction'

export default <Model>{
  namespace: SHOP_NAMESPACE,
  state: cloneDeepWith(defaultState),
  effects: {
    [GET_SHOP_INFO_ACTION]: function * (action: AnyAction, effects: EffectsCommandMap) {
      const { put, select } = effects
      const shopModel: ShopModelState = yield select((state: any) => state.shop)
      const { shopInfoMap  } = shopModel
      const id = action.payload && action.payload.id
      let resData: any = {}
      if (shopInfoMap.has(id)) {
        resData = shopInfoMap.get(id)
      } else {
        const res =  yield getShopInfoApi(id)
        if (res.success) {
          resData = res.data
          const cloneShopInfoMap = new Map(shopInfoMap)
          cloneShopInfoMap.set(id, resData)
          yield put({ type: SET_SHOP_INFO_MAP_ACTION, payload: cloneShopInfoMap });
        } else {
          errorMessage(res.message)
        }
      }
      yield put({ type: SET_SHOP_INFO_ACTION, payload: resData });
    }
  },
  reducers: {
    [SET_SHOP_INFO_MAP_ACTION](state: ShopModelState, action: AnyAction) {
      return { ...state, shopInfoMap: action.payload };
    },
    [SET_SHOP_INFO_ACTION](state: ShopModelState, action: AnyAction) {
      const shopInfo = { ...action.payload }
      return { ...state, shopInfo };
    },
    [SET_CUR_SHOP_INFO_ACTION]() {

    },
  }
}
