import { AnyAction } from 'redux'
import { Dispatch, EffectsCommandMap, Model } from 'dva'
import { cloneDeepWith } from 'lodash'
import { errorMessage } from '@/components/message'
import { getEnterpriseForShopApi, getUserBaseInfoApi } from '@/api/user'
import { UserEnterpriseInfo, UserInfo } from '@/interfaces/user'
import { getFullAction } from '@/utils/model'

export interface UserModelState {
  companyInfo: UserEnterpriseInfo | null;
  userInfo: UserInfo | null;
}

export const USER_NAMESPACE = 'user'
export const GET_USER_INFO_ACTION = 'getUserInfoAction'
export const SET_USER_INFO_ACTION = 'setUserInfoAction'

// 企业资料信息companyInfo
export const GET_COMPANY_INFO_ACTION = 'getCompanyInfoAction'
export const SET_COMPANY_INFO_ACTION = 'setCompanyInfoAction'

const defaultState: UserModelState = {
  companyInfo: null,
  userInfo: null
}

export const userMapStateToProps = (state: any): any => {
  const { companyInfo, userInfo } = state[USER_NAMESPACE];
  return { companyInfo, userInfo }
}

export const userMapDispatchToProps = (dispatch: Dispatch): any => {
  return {
    getCompanyInfo: () => dispatch({ type: getFullAction(USER_NAMESPACE, GET_COMPANY_INFO_ACTION) }),
    setCompanyInfo: (payload: UserEnterpriseInfo) => dispatch({ type: getFullAction(USER_NAMESPACE, SET_COMPANY_INFO_ACTION), payload }),
    getUserInfo: () => dispatch({ type: getFullAction(USER_NAMESPACE, GET_USER_INFO_ACTION) })
  }
}

export default <Model>{
  namespace: USER_NAMESPACE,
  state: cloneDeepWith(defaultState),
  effects: {
    [GET_COMPANY_INFO_ACTION]: function* (action: AnyAction, effects: EffectsCommandMap) {
      const { select, put } = effects
      let companyInfo: UserEnterpriseInfo = yield select((state: any) => state[USER_NAMESPACE].companyInfo)
      if (companyInfo) {
        yield put({ type: SET_COMPANY_INFO_ACTION, payload: companyInfo });
      } else {
        const { success, message, data } = yield getEnterpriseForShopApi()
        if (success) {
          yield put({ type: SET_COMPANY_INFO_ACTION, payload: data });
        } else {
          errorMessage(message)
          return
        }
      }
    },
    [GET_USER_INFO_ACTION]: function* (action: AnyAction, effects: EffectsCommandMap) {
      const { select, put } = effects
      let userInfo: UserInfo = yield select((state: any) => state[USER_NAMESPACE].userInfo)
      if (userInfo) {
        yield put({ type: SET_USER_INFO_ACTION, payload: userInfo });
      } else {
        const { success, message, data } = yield getUserBaseInfoApi()
        if (success) {
          yield put({ type: SET_USER_INFO_ACTION, payload: data });
        } else {
          errorMessage(message)
          return
        }
      }
    }
  },
  reducers: {
    [SET_COMPANY_INFO_ACTION]: (state: UserModelState, action: AnyAction) => {
      const companyInfo = action.payload
      return { ...state, companyInfo };
    },
    [SET_USER_INFO_ACTION]: (state: UserModelState, action: AnyAction) => {
      const userInfo = action.payload
      return { ...state, userInfo };
    }
  }
}
