import React, { FC, useEffect, useRef, useState } from 'react'
import { FormInstance, Spin, Form, Button } from 'antd';
import MainTitle from '@/components/main-title';
import { CompanyAdvantageListItem } from '@/interfaces/user';
import { getCompanyAdvantageApi, setCompanyAdvantageApi } from '@/api/user'
import styles from './index.less'
import CompanyAdvantageForm from './components/form/index'
const FormItem = Form.Item

const CompanyAdvantage: FC = () => {
  const [dataList, setDataList] = useState<CompanyAdvantageListItem[]>([])
  const [keyCount, setKeyCount] = useState<number>(1)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(true)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const newItem = {
    title: '',
    desc: '',
    bgImg: '',
    fontColor: 'black' as 'black',
  }
  const getCompanyAdvantage = async () => {
    setGetDataLoading(true)
    const res = await getCompanyAdvantageApi()
    if (res.success) {
      let nowKey = keyCount
      if (res.data?.length > 0) {
        setDataList(res.data.map(item => {
          nowKey++;
          return {
            ...item,
            key: nowKey
          }
        }))
        setKeyCount(nowKey)
      } else {
        nowKey++;
        setDataList([{
          ...newItem,
          key: nowKey
        }])
      }
    }
    setGetDataLoading(false)
  }

  const forms = useRef<{ forms: FormInstance }[]>([])

  useEffect(() => {
    getCompanyAdvantage()
  }, [])

  useEffect(() => {
    console.log(forms)
  }, [forms.current])

  const handleClickAdd = () => {
    let nowKey = keyCount
    nowKey++;
    setDataList([...dataList, {
      ...newItem,
      key: nowKey
    }])
  }

  return <>
    <MainTitle title="企业优势" />
    <Spin spinning={getDataLoading}>
      <div className={styles['container']}>
        {
          dataList.map((item, index) => <CompanyAdvantageForm item={item} index={index} key={item.key} ref={(ref) => forms.current[index] = ref} />)
        }
        <FormItem labelCol={{ span: 3 }}> <Button type="primary" className={`${styles['primary-btn']} ${styles['mvip-primary-btn']}`} onClick={handleClickAdd}>+增加优势</Button></FormItem>
      </div>
    </Spin>
  </>
}

(CompanyAdvantage as any).wrappers = ['@/wrappers/path-auth']

export default CompanyAdvantage