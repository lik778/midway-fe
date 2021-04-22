import React, { FC, useEffect, useRef, useState } from 'react'
import { FormInstance, Spin } from 'antd';
import MainTitle from '@/components/main-title';
import { CompanyAdvantageListItem } from '@/interfaces/user';
import { getCompanyAdvantageApi, setCompanyAdvantageApi } from '@/api/user'
import styles from './index.less'
import CompanyAdvantageForm from './components/form/index'
import { mockData } from '@/utils';



const CompanyAdvantage: FC = () => {
  const [dataList, setDataList] = useState<CompanyAdvantageListItem[]>([])
  const [keyCount, setKeyCount] = useState<number>(1)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(true)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  const getCompanyAdvantage = async () => {
    setGetDataLoading(true)
    // const res = await getCompanyAdvantageApi()
    const res = await mockData<CompanyAdvantageListItem[]>('data', [])
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

  const forms = useRef<{ forms: FormInstance | undefined }[]>([])

  useEffect(() => {
    getCompanyAdvantage()
  }, [])

  useEffect(() => {
    console.log(forms)
  }, [forms.current])

  return <>
    <MainTitle title="企业优势" />
    <Spin spinning={getDataLoading}>
      <div className={styles['container']}>
        {
          dataList.map((item, index) => <CompanyAdvantageForm item={item} ref={(ref) => forms.current[index] = ref} key={item.key} />)
        }
      </div>
    </Spin>
  </>
}

(CompanyAdvantage as any).wrappers = ['@/wrappers/path-auth']

export default CompanyAdvantage