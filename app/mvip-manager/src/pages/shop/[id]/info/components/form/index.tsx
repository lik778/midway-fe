import React, { FC, forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Form, Spin } from 'antd'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import WildcatForm from '@/components/wildcat-form';
import styles from './index.less'
import { ShopItemBasicInfoParams, InitShopItemBasicInfoParams, UploadShopBasicInfoParams } from '@/interfaces/shop';
import { errorMessage, successMessage } from '@/components/message';
import { ShopBasicInfoForm } from './config';
import { cloneDeepWith } from 'lodash';
import { setShopBasicInfoApi } from '@/api/shop'
import { objToTargetObj } from '@/utils';
import { getImgUploadModelValue } from '@/components/img-upload';

const FormItem = Form.Item

interface Props {
  id: number,
  shopBasicInfoParams: InitShopItemBasicInfoParams | {},
  getDataLoading: boolean
  onChange: () => void
}

const ShopBasicInfoSetForm = (props: Props, parentRef: Ref<any>) => {
  const { id, shopBasicInfoParams, onChange } = props

  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(ShopBasicInfoForm));
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);

  const updateConfigData = () => {
    if (!shopBasicInfoParams) {
      return
    }
    // 这里的shopBasicInfoParams可以为空对象 表示初始值为空
    const { firstCategory } = shopBasicInfoParams as InitShopItemBasicInfoParams
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
    console.log(shopBasicInfoParams)
  }, [shopBasicInfoParams])

  const sumbit = async (values: InitShopItemBasicInfoParams) => {
    const requestData: UploadShopBasicInfoParams = {
      ...values,
      promoteImg: getImgUploadModelValue(values.promoteImg)
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