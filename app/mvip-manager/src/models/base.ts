import { EffectsCommandMap, Model, Dispatch } from 'dva'
import { cloneDeepWith, isNull } from 'lodash'
import { MidMenuItem } from '@/interfaces/base'
import { getMenuApi } from '@/api/common'
import { errorMessage } from '@/components/message'
import { AnyAction } from 'redux'
import { getFullAction } from '@/utils/model'


interface BaseModelState {
  menuList: MidMenuItem[] | null;
  menuAuthList: string[] | null;
}

const defaultState: BaseModelState = {
  menuList: null,
  menuAuthList: null
}

const BASE_NAMESPACE = 'base'
export const GET_MENU_LIST_ACTION = 'getMenuListAction'
export const SET_MENU_LIST_ACTION = 'setMenuListAction'
export const SET_MENU_AUTH_LIST_ACTION = 'setMenuAuthListAction'


const traverseMenuList = (menuList: MidMenuItem[]): string[] => {
  const pathRet: string[] = []
  menuList.forEach(menu => {
    if (menu.hasOwnProperty('menuList')) {
      pathRet.push(...traverseMenuList(menu.menuList || []))
    }

    if (menu.path) pathRet.push(menu.path)
  })
  return pathRet
}


export const baseMapStateToProps = (state: any): any => {
  const { menuList, menuAuthList } = state[BASE_NAMESPACE];
  return { menuList, menuAuthList }
}

export const baseMapDispatchToProps = (dispatch: Dispatch): any => {
  return {
    getMenuList: () => dispatch({ type: getFullAction(BASE_NAMESPACE, GET_MENU_LIST_ACTION) })
  }
}


export default <Model>{
  namespace: BASE_NAMESPACE,
  state: cloneDeepWith(defaultState),
  effects: {
    [GET_MENU_LIST_ACTION]: function* (action: AnyAction, effects: EffectsCommandMap) {
      const { put, select } = effects
      const menuList: MidMenuItem[] | null = yield select((state: any) => state[BASE_NAMESPACE].menuList)
      if (isNull(menuList)) {
        const { success, message, data: { menuList } } = yield getMenuApi()
        if (success) {
          yield put({ type: SET_MENU_LIST_ACTION, payload: menuList })
          yield put({ type: SET_MENU_AUTH_LIST_ACTION, payload: traverseMenuList(menuList) })
        } else {
          errorMessage(message)
        }
      }
    },
  },
  reducers: {
    [SET_MENU_LIST_ACTION]: function (state: BaseModelState, action: AnyAction) {
      return { ...state, menuList: [...action.payload] }
    },
    [SET_MENU_AUTH_LIST_ACTION]: function (state: BaseModelState, action: AnyAction) {
      return { ...state, menuAuthList: [...action.payload] }
    }
  }
}
