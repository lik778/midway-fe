import React, { FC, useState, useEffect } from 'react'
import { Spin } from 'antd'
import { useParams } from 'umi'
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE } from '@/models/shop';
import WildcatForm from '@/components/wildcat-form';
import { ShopInfo, CommonMessageSetting, paramsItem } from '@/interfaces/shop'
// 留言表单创建接口
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
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [formConfig, setformConfig] = useState<FormConfig>(MessageForm())
  const [contactFields, setContactFields] = useState<CommonMessageSetting[]>([])
  const { id: shopId } = useParams<{ id: string }>()
  const sumbit = async (item: any) => {
    setFormLoading(true)
    // 发请求
    const { button, name, params, tel, title } = item
    const newParams = params && params.map((item: any) => {
      return ({
        title: item.key,
        des: item.value,
        position: 'content',
        fixed: false
      })
    }) || []
    const newContactFields = [
      {
        title: '表单标题',
        des: title,
        position: 'title',
        fixed: true
      },
      {
        title: '姓名',
        des: name,
        position: 'content',
        fixed: true
      },
      {
        title: '联系方式',
        des: tel,
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
    const res = await setConsultMessageApi(Number(shopId), newContactFields)
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
  // 获取初始值
  const onInit = (form: any) => {
    setGetDate(true)
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
        const arry = []
        form.setFieldsValue({
          params: arry.push(listItem)
        })
      }
    })
    setGetDate(false)

  }
  useEffect(() => {
    initForm()
  }, [])

  return (
    <Spin spinning={getDate}>
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


export default connect((state: ConnectState) => {
  const { curShopInfo } = state[SHOP_NAMESPACE]
  return { curShopInfo }
})(CommonMessageForm)