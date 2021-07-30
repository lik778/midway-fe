import React, { FC, useEffect, useMemo, useState } from 'react'
import { useParams } from 'umi';
import { Spin } from 'antd'
import { connect } from 'dva';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { ConnectState } from '@/models/connect'
import { ShopInfo } from '@/interfaces/shop';
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import { ShopBasisType } from '@/enums'
import { InitShopBasicInfoParams } from '@/interfaces/shop'
import ShopBasicInfoForm from './components/form'



const CustomerSet: FC<{ curShopInfo: ShopInfo | null, loadingShopModel: boolean }> = (props) => {
  const { curShopInfo, loadingShopModel } = props

  const { id } = useParams<{ id: string }>()
  const initShopBasicInfoParams = useMemo<InitShopBasicInfoParams | {} | null>(() => {
    if (curShopInfo) {
      if (curShopInfo.about && curShopInfo.about.length > 0) {
        return JSON.parse(curShopInfo.about) as InitShopBasicInfoParams
      } else {
        return {}
      }
    } else {
      return null
    }
  }, [curShopInfo])


  return <>
    <BasisHeader type={ShopBasisType.INFO} />

    <Spin spinning={loadingShopModel}>
      <div className="container">
        {
          initShopBasicInfoParams && <ShopBasicInfoForm id={Number(id)} shopBasicInfoParams={initShopBasicInfoParams} getDataLoading={loadingShopModel} onChange={() => {
            window.location.reload()
          }}></ShopBasicInfoForm>
        }
      </div>
    </Spin>
  </>
}

//取状态管理里的当前店铺信息，用于判断店铺类型
export default connect<any>((state: any) => {
  const { curShopInfo } = (state as ConnectState)[SHOP_NAMESPACE]
  const { loading } = (state as ConnectState)
  return { curShopInfo, loadingShopModel: loading.models.shop }
}, (dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch),
  }
})(CustomerSet)
