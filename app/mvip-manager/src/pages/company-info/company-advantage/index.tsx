import React, { FC, useEffect, useRef, useState } from 'react'
import { FormInstance, Spin, Form, Button } from 'antd';
import MainTitle from '@/components/main-title';
import { CompanyAdvantageListItem } from '@/interfaces/user';
import { getCompanyAdvantageApi, setCompanyAdvantageApi } from '@/api/user'
import styles from './index.less'
import CompanyAdvantageForm from './components/form/index'
import { errorMessage, successMessage } from '@/components/message';
import form from './components/form/index';
const FormItem = Form.Item

const CompanyAdvantage: FC = () => {
  const [dataList, setDataList] = useState<CompanyAdvantageListItem[]>([])
  const [keyCount, setKeyCount] = useState<number>(0)
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
      const newDataList = []
      if (res.data?.length === 0) {
        let i = 0
        while (i < 2) {
          nowKey++;
          newDataList.push({
            ...newItem,
            key: `key${nowKey}`
          })
          i++;
        }
      } else {
        if (res.data.length === 1) {
          nowKey++;
          newDataList.push({
            ...res.data[0],
            key: `key${nowKey}`
          })
          nowKey++;
          newDataList.push({
            ...newItem,
            key: `key${nowKey}`
          })
        } else {
          newDataList.push(...res.data.map(item => {
            nowKey++;
            return {
              ...item,
              key: `key${nowKey}`
            }
          }))
        }
      }
      setDataList(newDataList)
      setKeyCount(nowKey)
    }
    setGetDataLoading(false)
  }

  const forms = useRef<{ form: FormInstance }[]>([])

  useEffect(() => {
    getCompanyAdvantage()
  }, [])

  const handleClickAdd = () => {
    let nowKey = keyCount
    nowKey++;
    setDataList([...dataList, {
      ...newItem,
      key: `key${nowKey}`
    }])
    setKeyCount(nowKey)
  }

  const handleDeleteItem = (key: string) => {
    const newDataList = dataList.filter(item => item.key !== key)
    setDataList(newDataList)
  }

  /** 当出现错误reture false */
  const validateForm = async () => await Promise.all(forms.current.filter(item => item).map((item) => item.form.validateFields()))

  const sumbit = async () => {
    try {
      await validateForm()
      const values = forms.current.filter(item => item).map(item => {
        return item.form.getFieldsValue()
      })
      setUpDataLoading(true)
      console.log(values)
      const res = await setCompanyAdvantageApi(values)
      if (res.success) {
        successMessage(res.message || '保存成功')
      } else {
        errorMessage(res.message || '保存失败，请稍后再试！')
      }
      setUpDataLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  return <>
    <MainTitle title="企业优势" />
    <Spin spinning={getDataLoading}>
      <div className={styles['container']}>
        {
          dataList.map((item, index) => <CompanyAdvantageForm item={item} index={index} key={item.key} total={dataList.length} ref={(ref) => forms.current[index] = ref} onDel={handleDeleteItem} />)
        }
        {
          dataList.length < 10 && <Button className={`${styles['add-btn']}`} type="primary" onClick={handleClickAdd}>+增加优势</Button>
        }
        <div>
          <Button className={`${styles['submit-btn']}`} loading={upDataLoading} disabled={upDataLoading}
            type="primary" onClick={sumbit}>保存</Button>
        </div>
      </div>
    </Spin>
  </>
}

(CompanyAdvantage as any).wrappers = ['@/wrappers/path-auth']

export default CompanyAdvantage