import React, { FC, useEffect, useMemo, useState } from 'react'
import { useParams } from 'umi';
import { Spin } from 'antd'
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import { ShopBasisType } from '@/enums'
import styles from './index.less'
import { getShopBasicInfoApi } from '@/api/shop'
import { ShopBasicInfo, InitShopBasicInfoParams } from '@/interfaces/shop'
import ShopBasicInfoForm from './components/form'
const CustomerSet: FC = () => {
  const { id } = useParams<{ id: string }>()
  const [detail, setDeatil] = useState<ShopBasicInfo | null>(null)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const initShopBasicInfoParams = useMemo<InitShopBasicInfoParams | null>(() => {
    if (detail) {
      return {
        companyName: detail.company?.name,
        companyAlias: detail.company?.alias,// 店铺名称 默认值取得店铺名称
        area: detail.area,
        companyAddress: detail.company?.address,
        companyDescription: detail.company?.about,
        promoteImg: detail.company?.logo,
        contactName: detail.contact?.contactName.content,
        contactMobile: detail.contact?.phone.content,
        contactMobile2: detail.contact?.phone2.content,
        wechat: detail.contact?.weChat.content,
      } as InitShopBasicInfoParams
    } else {
      return null
    }
  }, [detail])

  // 这个版本没有获取module列表接口
  const getShopBasicInfo = async () => {
    setGetDataLoading(true)
    const res = await getShopBasicInfoApi(Number(id))
    setDeatil(res.data)
    setGetDataLoading(false)
  }

  useEffect(() => {
    getShopBasicInfo()
  }, [])

  const handleChangeInfo = () => {
    getShopBasicInfo()
  }

  return <>
    <BasisHeader type={ShopBasisType.INFO} />

    <Spin spinning={getDataLoading}>
      <div className="container">
        {
          initShopBasicInfoParams && <ShopBasicInfoForm id={Number(id)} shopBasicInfoParams={initShopBasicInfoParams} getDataLoading={getDataLoading} onChange={handleChangeInfo}></ShopBasicInfoForm>
        }
      </div>
    </Spin>
  </>
}

export default CustomerSet