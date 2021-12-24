import React, { FC, useState, useEffect } from 'react'
import { Spin } from 'antd'
import { useParams } from 'umi'
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { successMessage, errorMessage } from '@/components/message'
import { SHOP_NAMESPACE } from '@/models/shop';
import WildcatForm from '@/components/wildcat-form';
import { ShopInfo, CommonMessageSetting, ParamsItem, CommonFormParams } from '@/interfaces/shop'
import { setConsultMessageApi, } from '@/api/shop'
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { MessageForm } from './config'
import MessageList from '../form-list'
import styles from './index.less'
interface Iprop {
  curShopInfo?: ShopInfo | null
}

const CommonMessageForm: FC<Iprop> = (props) => {
  const { curShopInfo } = props
  const [getDate, setGetDate] = useState<boolean>(false)
  const [upDate, setUpDate] = useState<boolean>(false)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [formConfig, setformConfig] = useState<FormConfig>(MessageForm())
  const { id: shopId } = useParams<{ id: string }>()
  const sumbit = async (item: any) => {
    setFormLoading(true)
    setUpDate(true)
    const { button, name, params, tel, title }: CommonFormParams = item
    const newParams: CommonMessageSetting[] = params && params.map((item: ParamsItem) => {
      return ({
        title: item.key,
        des: item.value,
        position: 'content',
        fixed: false
      })
    }) || []
    const newContactFields: CommonMessageSetting[] = [
      {
        title: '表单标题',
        des: title,
        position: 'title',
        fixed: true
      },
      {
        title: '姓名',
        des: name.value,
        position: 'content',
        fixed: true
      },
      {
        title: '联系方式',
        des: tel.value,
        position: 'content',
        fixed: true
      },
      {
        title: '表单按钮',
        des: button,
        position: 'button',
        fixed: true
      },
      ...newParams
    ]
    const res = await setConsultMessageApi(Number(shopId), { fields: newContactFields })
    res.success ? successMessage('保存成功') : errorMessage('保存失败')
    setFormLoading(false)
    setUpDate(false)
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
  // 设置初始值
  const onInit = (form: any) => {
    setGetDate(true)
    const arry: ParamsItem[] = []
    curShopInfo && curShopInfo.contactFields.forEach(item => {
      if (item.position === 'button') {
        form.setFieldsValue({
          button: item.des
        })
      } else if (item.position === 'title') {
        form.setFieldsValue({
          title: item.des
        })
      } else if (item.position === 'content' && item.title === '联系方式') {
        form.setFieldsValue({
          tel: { key: '联系方式', value: item.des }
        })
      } else if (item.position === 'content' && item.title === '姓名') {
        form.setFieldsValue({
          name: { key: '姓名', value: item.des }
        })
      } else {
        const listItem = { key: item.title, value: item.des }
        arry.push(listItem)
      }
      form.setFieldsValue({
        params: arry
      })
    })
    setGetDate(false)

  }
  useEffect(() => {
    initForm()
  }, [curShopInfo])

  return (
    <Spin spinning={getDate || upDate}>
      <div className={styles['Form-creation']}>表单创建</div>
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


export default connect((state: ConnectState) => {
  const { curShopInfo } = state[SHOP_NAMESPACE]
  return { curShopInfo }
})(CommonMessageForm)