import React, { FC, useState, useEffect, useMemo } from 'react'
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
  useEffect(() => {
    initForm()
  }, [curShopInfo])
  // 验证数组是否有重复的
  const repeatArray = (arr: ParamsItem[]) => {
    const hash: any = {}
    const newArr = arr.map((item: ParamsItem) => item.key.trim())
    for (const i in newArr) {
      if (hash.hasOwnProperty(newArr[i])) return true
      hash[newArr[i]] = true
    }
    return false
  }
  const sumbit = async (item: any) => {
    // item 预处理，去除多余的空格
    const newItem = {
      button: item.button.trim(),
      name: { key: item.name.key.trim(), value: item.name.value.trim() }
    }
    const CustomParameters = item.params
    if (CustomParameters && CustomParameters.length > 0) {
      const flag = CustomParameters.some((item: any) => item.key.trim() === '姓名' || item.key.trim() === '联系方式') || repeatArray(CustomParameters)
      if (flag) return errorMessage('自定义参数名重复')
    }
    setFormLoading(true)
    setUpDate(true)
    const { button, name, params, tel, title }: CommonFormParams = item
    const newParams: CommonMessageSetting[] = params && params.map((item: ParamsItem) => {
      return ({
        title: item.key.trim(),
        des: (item.value || '').trim(),
        position: 'content',
        fixed: item.switch
      })
    }) || []
    const newContactFields: CommonMessageSetting[] = [
      {
        title: '表单标题',
        des: title.trim(),
        position: 'title',
        fixed: true
      },
      {
        title: '姓名',
        des: name.value.trim(),
        position: 'content',
        fixed: true
      },
      {
        title: '联系方式',
        des: tel.value.trim(),
        position: 'content',
        fixed: true
      },
      {
        title: '表单按钮',
        des: button.trim(),
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

  const initShopBasicInfoParams = useMemo(() => {
    const formparams: any = {}
    const paramsArry: any = []
    if (curShopInfo) {
      if (curShopInfo.contactFields && curShopInfo.contactFields.length > 0) {
        curShopInfo.contactFields.forEach(item => {
          if (item.position === 'button') {
            formparams.button = item.des
          } else if (item.position === 'title') {
            formparams.title = item.des
          } else if (item.position === 'content' && item.title === '联系方式') {
            formparams.tel = { key: item.title, value: item.des, switch: item.fixed }
          } else if (item.position === 'content' && item.title === '姓名') {
            formparams.name = { key: item.title, value: item.des, switch: item.fixed }
          } else {
            paramsArry.push(
              { key: item.title, value: item.des, switch: item.fixed }
            )
            formparams.params = paramsArry
          }
        })
      }
    }
    return formparams
  }, [curShopInfo])

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

  return (
    <Spin spinning={getDate || upDate}>
      <div className={styles['Form-creation']}>表单创建</div>
      <WildcatForm
        editDataSource={initShopBasicInfoParams}
        submit={sumbit}
        config={formConfig}
        loading={formLoading}
        className="product-form"
      />
    </Spin>
  )
}


export default connect((state: ConnectState) => {
  const { curShopInfo } = state[SHOP_NAMESPACE]
  return { curShopInfo }
})(CommonMessageForm)