import React, { useState, FC, useEffect, useRef, useCallback } from 'react';
import { AiModuleContextProps } from './data'
import AiModuleContext, { defaultValue as defaultContextValue } from './context'
import { AnyAction, Dispatch } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { CreateShopParams, ShopInfo, ShopStatus } from '@/interfaces/shop';
import { Spin } from 'antd';
import { useDebounce } from '@/hooks/debounce';
import { getUserVipResources } from '@/api/ai-module'

interface Props {
  dispatch: Dispatch<AnyAction>;
  shopStatus: ShopStatus | null;
  loadingShop: boolean,
  getShopStatus: () => Promise<any>
}


const AiModule: FC<Props> = (props) => {
  const { getShopStatus, loadingShop, shopStatus } = props
  const [contextValue, setContextValue] = useState<AiModuleContextProps>({ ...defaultContextValue })

  // 合并一下更新的次数，不然同时来两次更新，数据会被冲掉
  const cacheData = useRef<Partial<AiModuleContextProps>[]>([])
  const mergeSetContextValue = useDebounce(() => {
    const newContextValue = Object.assign({}, contextValue, ...cacheData.current)
    cacheData.current = []
    setContextValue(newContextValue)
  }, 10, { trailing: true, leading: false })

  const handleChangeContextData = (data: {
    [key in keyof AiModuleContextProps]?: any
  }) => {
    cacheData.current.push(data)
    mergeSetContextValue()
  }

  const getUserVipResourcesFn = async () => {
    const res = await getUserVipResources()
    if (res.success) {
      console.log('getUserVipResourcesFn', res.data)
      handleChangeContextData({
        postToolData: {
          ...contextValue.postToolData,
          vipResourcesList: res.data,
          selectedVipResources: res.data[0]
        }
      })
    }
  }

  // 获取基础信息是否填写状态
  const initPage = async () => {
    Promise.all([getUserVipResourcesFn(), getShopStatus()])
  }


  useEffect(() => {
    console.log(contextValue.activeModuleKey)
  }, [contextValue.activeModuleKey])

  useEffect(() => {
    initPage()
  }, [])

  return <Spin spinning={loadingShop}>
    <AiModuleContext.Provider value={{
      ...contextValue,
      shopStatus,
      loadingShop,
      handleChangeContextData
    }}>
      {props.children}
    </AiModuleContext.Provider>
  </Spin>
}

export default connect((state: ConnectState) => {
  const { shopStatus } = state[SHOP_NAMESPACE]
  const { loading } = state
  return { shopStatus, loadingShop: loading.models.shop }
}, (dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch),
  }
})(AiModule)