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

// 公司信息
export const GET_COMPANY_INFO_ACTION = 'getCompanyInfoAction'
export const SET_COMPANY_INFO_ACTION = 'setCompanyInfoAction'
export const SAVE_COMPANY_INFO_ACTION = 'saveCompanyInfoAction'

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
        yield put({ type: SET_COMPANY_INFO_ACTION, playload: companyInfo });
      } else {
        const { success, message, data } =  yield getEnterpriseForShopApi()
        if (success) {
          yield put({ type: SET_COMPANY_INFO_ACTION, playload: data });
        } else {
          errorMessage(message)
          return
        }
      }
    }
  },
  reducers: {
    [SET_COMPANY_INFO_ACTION]: (state: UserModelState, action: AnyAction) => {
      const companyInfo = action.playload
      return { ...state, companyInfo  };
    }
  }
}
