
import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'umi';
import { Spin } from 'antd'
import CustomerItem from './components/customer-item'
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import { ShopBasisType } from '@/enums'
import styles from './index.less'
import { getCustomerModuleListApi } from '@/api/shop'
import { CustomerSetListItem, CustomerListItem } from '@/interfaces/shop'
const CustomerSet: FC = () => {
  const { id } = useParams<{ id: string }>()
  const [dataList, setDataList] = useState<CustomerListItem[]>([])
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  // 这个版本没有获取module列表接口
  const getCustomerModuleList = async () => {
    setGetDataLoading(true)
    const res = await getCustomerModuleListApi(Number(id))
    setDataList(res.data.mainModuleBos.length > 0 ? res.data.mainModuleBos : [{ mainModuleId: NaN, title: '自定义模块' }])
    setGetDataLoading(false)
  }

  useEffect(() => {
    getCustomerModuleList()
  }, [])

  return <>
    <BasisHeader type={ShopBasisType.CUSTOMER} />

    <Spin spinning={getDataLoading}>
      <div className={styles['container']}>
        {
          dataList.length > 0 && <CustomerItem mainModuleId={dataList[0].mainModuleId} onSave={getCustomerModuleList}></CustomerItem>
        }
      </div>
    </Spin>
  </>
}

export default CustomerSet