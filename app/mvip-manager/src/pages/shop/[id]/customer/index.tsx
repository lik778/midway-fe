import { getCustomerModuleListApi } from '@/api/shop'
import { CustomerSetListItem } from '@/interfaces/shop'
import React, { FC, useEffect, useState } from 'react'
import CustomerItem from './components/customer-item'
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import { ShopBasisType } from '@/enums'

const CustomerSet: FC = () => {
  const [dataList, setDataList] = useState<{ id: number, title: string }[]>([])
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  // 这个版本没有获取module列表接口
  const getCustomerModuleList = async () => {
    setGetDataLoading(true)
    const res = await getCustomerModuleListApi()
    setDataList(res.data)
    setGetDataLoading(false)
  }

  useEffect(() => {
    // getCustomerModuleList()
  }, [])

  return <>
    <BasisHeader type={ShopBasisType.CUSTOMER} />
    <CustomerItem></CustomerItem>
  </>
}

export default CustomerSet