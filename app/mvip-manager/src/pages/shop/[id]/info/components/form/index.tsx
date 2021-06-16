import React, { FC, forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Form, FormInstance, Input, Radio } from 'antd'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import WildcatForm from '@/components/wildcat-form';
import styles from './index.less'
import { InitShopBasicInfoParams, UploadShopBasicInfoParams } from '@/interfaces/shop';
import { errorMessage, successMessage } from '@/components/message';
import { ShopBasicInfoForm } from './config';
import { cloneDeepWith } from 'lodash';
import { setShopBasicInfoApi } from '@/api/shop'

const FormItem = Form.Item

interface Props {
  id: number,
  shopBasicInfoParams: InitShopBasicInfoParams,
  getDataLoading: boolean
  onChange: () => void
}

const ShopBasicInfoSetForm = (props: Props, parentRef: Ref<any>) => {
  const { id, shopBasicInfoParams, getDataLoading, onChange } = props

  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(ShopBasicInfoForm));
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);


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
    <>
      <div className="container">
        <WildcatForm
          editDataSource={shopBasicInfoParams}
          submit={sumbit}
          config={config}
          formChange={formChange}
        />
      </div>
    </>)
}

export default forwardRef(ShopBasicInfoSetForm)