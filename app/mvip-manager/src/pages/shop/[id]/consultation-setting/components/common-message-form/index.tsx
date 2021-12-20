import React, { FC, useState, useEffect } from 'react'
import { Spin } from 'antd'
import { useParams } from 'umi'
import WildcatForm from '@/components/wildcat-form';
// 留言表单创建接口
import { setConsultMessageApi } from '@/api/shop'
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { MessageForm } from './config'
import MessageList from '../form-list'
import styles from './index.less'
interface Iprop {
  [key: string]: any
}

const CommonMessageForm: FC<Iprop> = (prop) => {
  const { loadingShopModel } = prop
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [formConfig, setformConfig] = useState<FormConfig>(MessageForm())
  const { id: shopId } = useParams<{ id: string }>()
  const sumbit = (item: any) => {
    setFormLoading(true)
    console.log(item)
    setFormLoading(false)
  }

  // 初始化表单
  const initForm = () => {
    const newFormConfig = MessageForm()
    newFormConfig.customerFormItemList = [{
      key: 'params',
      index: 2,
      node: <MessageList />
    }]
    setformConfig({
      ...newFormConfig
    })
  }
  const onInit = (form: any) => {
  }
  useEffect(() => {
    initForm()
  }, [])

  return (
    <Spin spinning={false}>
      <div className={styles['common-title']}>表单创建</div>
      <WildcatForm
        submit={sumbit}
        config={formConfig}
        loading={formLoading}
        className="product-form"
        onInit={onInit}
      />
    </Spin>
  )
}

export default CommonMessageForm