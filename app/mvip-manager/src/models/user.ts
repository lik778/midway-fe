import { AnyAction } from 'redux';
import { EffectsCommandMap, Model } from 'dva';
import { cloneDeepWith } from 'lodash';
import { errorMessage } from '@/components/message';
import { getEnterpriseForShopApi } from '@/api/user';
import { UserEnterpriseInfo, UserInfo } from '@/interfaces/user';

interface UserModelState {
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

export const companyInfoStateToProps = (state: any): { [key: string]: UserEnterpriseInfo } => {
  const { companyInfo } = state[USER_NAMESPACE]
  return { companyInfo }
}

export default <Model>{
  namespace: USER_NAMESPACE,
  state: cloneDeepWith(defaultState),
  effects: {
    [GET_COMPANY_INFO_ACTION]: function *(action: AnyAction, effects: EffectsCommandMap) {
      const { select, put } = effects
      let companyInfo: UserEnterpriseInfo = yield select((state: any) => state[USER_NAMESPACE].companyInfo)
      if (companyInfo) {
        yield put({ type: SET_COMPANY_INFO_ACTION, payload: companyInfo });
      } else {
        const { success, message, data } =  yield getEnterpriseForShopApi()
        if (success) {
          yield put({ type: SET_COMPANY_INFO_ACTION, payload: data });
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
      return { ...state, companyInfo  };
    }
  }
}
