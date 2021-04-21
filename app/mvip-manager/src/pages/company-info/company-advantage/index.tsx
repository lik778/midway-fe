import React, { FC, useRef, useState } from 'react'
import { FormInstance } from 'antd';
import MainTitle from '@/components/main-title';
import { zhidaoInfoForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { CompanyAdvantageListItem } from '@/interfaces/user';
import { getCompanyAdvantageApi, setCompanyAdvantageApi } from '@/api/user'

const CompanyAdvantage: FC = () => {
  const [dataList, setDataList] = useState<CompanyAdvantageListItem[]>([])
  const [keyCount, setKeyCount] = useState<number>(1)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(true)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const getCompanyAdvantage = async () => {
    const res = await getCompanyAdvantageApi()
    if (res.success) {
      let nowkey = keyCount
      if (res.data?.length > 0) {
        setDataList(res.data.map(item => {
          nowkey++;
          return {
            ...item,
            key: nowkey
          }
        }))
        setKeyCount(nowkey)
      } else {
        nowkey++;
        setDataList([{
          title: '',
          desc: '',
          bgImg: '',
          fontColor: 'black',
          key: nowkey
        }])
      }
    }
    setGetDataLoading(false)
  }

  const ref = useRef<{ form: FormInstance | undefined }>({ form: undefined })

  
  return <div>123</div>
}

(CompanyAdvantage as any).wrappers = ['@/wrappers/path-auth']

export default CompanyAdvantage