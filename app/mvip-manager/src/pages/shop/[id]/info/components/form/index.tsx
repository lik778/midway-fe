import React, { FC, forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Form, Spin } from 'antd'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import WildcatForm from '@/components/wildcat-form';
import styles from './index.less'
import { InitShopBasicInfoParams, UploadShopBasicInfoParams } from '@/interfaces/shop';
import { errorMessage, successMessage } from '@/components/message';
import { ShopBasicInfoForm } from './config';
import { cloneDeepWith } from 'lodash';
import { setShopBasicInfoApi } from '@/api/shop'
import { objToTargetObj } from '@/utils';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { useDebounce } from '@/hooks/debounce';
const FormItem = Form.Item

interface Props {
  id: number,
  shopBasicInfoParams: InitShopBasicInfoParams | {},
  getDataLoading: boolean
  onChange: () => void
}

const ShopBasicInfoSetForm = (props: Props, parentRef: Ref<any>) => {
  const { id, shopBasicInfoParams, getDataLoading, onChange } = props

  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(ShopBasicInfoForm));
  const [phoneTipShow, setphoneTipShow] = useState(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);

  const updateConfigData = () => {
    if (!shopBasicInfoParams) {
      return
    }
    // 这里的shopBasicInfoParams可以为空对象 表示初始值为空
    const { firstCategory } = shopBasicInfoParams as InitShopBasicInfoParams
    const newChildren = config.children.map(item => {
      //修改config里类目选择组件的配置信息，并给select加了onChange
      if (item.type === 'MetaSelect') {
        item.options = objToTargetObj(firstCategory)
      }
      return item
    })
    setConfig({ ...config, children: newChildren })
  }

  //会根据企业信息变更，重新渲染大表单
  useEffect(() => {
    updateConfigData()
  }, [shopBasicInfoParams])

  const sumbit = async (values: InitShopBasicInfoParams) => {
    const requestData: UploadShopBasicInfoParams = {
      ...values
    }
    // 下面两个是表单里的额外字段，用于保存类目的，避免接口有多余字段，所以删除
    // @ts-ignore
    delete requestData.metaCascaderValue
    // @ts-ignore
    delete requestData.metaCheckbox
    setUpDataLoading(true)
    const { success, message, data } = await setShopBasicInfoApi(id, requestData)
    if (success) {
      successMessage('保存成功')
      onChange()
    } else {
      errorMessage(message || '出错了')
    }
    setUpDataLoading(false)
  }

  const formChange = useDebounce((changeValue: any, allValues: any) => {
    //手机正则 
    const landlinePtn = /(^400[0123456789]\d{6}$)|(^400-[0123456789]\d{2}-\d{4}$)/
    setphoneTipShow(changeValue.contactMobile && landlinePtn.test(changeValue.contactMobile))
  }, 100)


  return (
    <Spin spinning={upDataLoading}>
      <div className={`container ${styles['shop-container']}`}>
        <WildcatForm
          editDataSource={shopBasicInfoParams}
          submit={sumbit}
          config={config}
          formChange={formChange}
        />
        <span className={phoneTipShow ? styles['phone-block'] : styles['phone-none']}>由于座机号码无法接收短信，请及时绑定“百姓商户”公众号进行留咨接收</span>
      </div>
    </Spin >)
}

export default forwardRef(ShopBasicInfoSetForm)