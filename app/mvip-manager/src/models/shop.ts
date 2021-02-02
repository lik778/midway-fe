import { getShopInfoApi } from '@/api/shop';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Model } from 'dva';
import { cloneDeepWith } from 'lodash'
import { ShopInfo } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';

interface ShopModelState {
  shopInfo: ShopInfo | null;
  shopInfoMap: Map<number, ShopInfo>;
}

const defaultState: ShopModelState = {
  shopInfo: null,
  shopInfoMap: new Map()
}

export const SHOP_NAMESPACE = 'shop'
export const SAVESHOPINFO_ACTION = 'saveShopInfo'
export const SET_SHOPINFOMAP_ACTION = 'setShopInfoMap'
export const GETSHOPINFO_ACTION = 'getShopInfo'
export const GETSHOPINFO_OUT_ACTION = `${SHOP_NAMESPACE}/${GETSHOPINFO_ACTION}`

export default <Model>{
  namespace: SHOP_NAMESPACE,
  state: cloneDeepWith(defaultState),
  effects: {
    *getShopInfo(action: AnyAction, effects: EffectsCommandMap) {
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
          yield put({ type: SET_SHOPINFOMAP_ACTION, payload: cloneShopInfoMap });
        } else {
          errorMessage(res.message)
        }
      }
      yield put({ type: SAVESHOPINFO_ACTION, payload: resData });
    }
  },
  reducers: {
    [SET_SHOPINFOMAP_ACTION](state: ShopModelState, action: AnyAction) {
      return { ...state, shopInfoMap: action.payload };
    },
    [SAVESHOPINFO_ACTION](state: ShopModelState, action: AnyAction) {
      const shopInfo = { ...action.payload }
      return { ...state, shopInfo };
    },
  }
}
