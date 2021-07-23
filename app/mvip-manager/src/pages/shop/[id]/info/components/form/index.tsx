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

const FormItem = Form.Item

interface Props {
  id: number,
  shopBasicInfoParams: InitShopBasicInfoParams | null,
  getDataLoading: boolean
  onChange: () => void
}

const ShopBasicInfoSetForm = (props: Props, parentRef: Ref<any>) => {
  const { id, shopBasicInfoParams, getDataLoading, onChange } = props

  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(ShopBasicInfoForm));
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);

  const updateConfigData = () => {
    if (!shopBasicInfoParams) {
      return
    }
    const { firstCategory } = shopBasicInfoParams
    const newChildren = config.children.map(item => {
      //修改config里类目选择组件的配置信息，并给select加了onChange
      if (item.type === 'MetaSelect') {
        item.options = objToTargetObj(firstCategory)
      }
      return item
    })
    console.log(newChildren)
    setConfig({ ...config, children: newChildren })
  }

  //会根据企业信息变更，重新渲染大表单
  useEffect(() => {
    updateConfigData()
  }, [shopBasicInfoParams])

  const sumbit = async (values: InitShopBasicInfoParams) => {
    const requestData: UploadShopBasicInfoParams = {
      ...values,
      area: !Array.isArray(values.area) ? Object.keys(values.area).map(k => k) : values.area
    }
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

  const formChange = (...arg: any) => {
    //console.log(arg)  
  }

  return (
    <Spin spinning={upDataLoading}>
      <div className="container">
        <WildcatForm
          editDataSource={shopBasicInfoParams}
          submit={sumbit}
          config={config}
          formChange={formChange}
        />
      </div>
    </Spin>)
}

export default forwardRef(ShopBasicInfoSetForm)