import React, { useState, FC, useEffect } from 'react';
import { AiModuleContextProps } from './data'
import AiModuleContext, { defaultValue as defaultContextValue } from './context'
import { AnyAction, Dispatch } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { CreateShopParams, ShopInfo, ShopStatus } from '@/interfaces/shop';
import { Spin } from 'antd';
interface Props {
  dispatch: Dispatch<AnyAction>;
  shopStatus: ShopStatus | null;
  loadingShop: boolean,
  getShopStatus: () => Promise<any>
}


const AiModule: FC<Props> = (props) => {
  const { getShopStatus, loadingShop, shopStatus } = props
  const [contextValue, setContextValue] = useState<AiModuleContextProps>({ ...defaultContextValue })

  const handleChangeContextData = (data: {
    [key in keyof AiModuleContextProps]?: any
  }) => {
    setContextValue({
      ...contextValue,
      ...data
    })
  }

  // 获取基础信息是否填写状态
  const initPage = async () => {
    await getShopStatus()
  }

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