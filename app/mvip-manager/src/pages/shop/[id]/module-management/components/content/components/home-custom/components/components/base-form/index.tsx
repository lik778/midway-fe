import React, { FC, useRef, useState, useImperativeHandle, forwardRef, Ref, ReactNode } from 'react'
import { FormInstance } from 'antd';
import { useParams } from 'umi'
import { setCustomerSetShowApi } from '@/api/shop'
import { errorMessage, successMessage } from '@/components/message';
import WildcatForm from '@/components/wildcat-form'
import { CustomerFormItem, FormConfig, FormItem } from '@/components/wildcat-form/interfaces'
import { CustomBaseForm } from './config'
import { ModuleID } from '../../../data';

interface Props {
  moduleID: ModuleID,
  formItems: FormItem[],
  customerFormItems?: CustomerFormItem[]
}

const BaseForm = (props: Props, parentRef: Ref<{
  formFn: () => (FormInstance | null)
}>) => {
  const { moduleID, formItems, customerFormItems } = props
  const { id: shopId } = useParams<{ id: string }>()
  const [upDateLoading, setUpDateLoading] = useState(false)
  const ref = useRef<{ form: FormInstance | null }>({ form: null })

  const [config] = useState<FormConfig>(() => CustomBaseForm(moduleID, formItems, customerFormItems))

  useImperativeHandle(parentRef, () => {
    return {
      formFn: () => ref.current.form
    }
  })

  const handleChangeShow = async (changedValues: any, values: any) => {
    if (typeof changedValues.show === 'boolean') {
      setUpDateLoading(true)
      const res = await setCustomerSetShowApi(Number(shopId), {
        mainModuleId: Number(moduleID),
        show: changedValues.show,
      })
      if (res.success) {
        successMessage(res.message || '保存成功')
      } else {
        errorMessage(res.message || '保存失败，请稍后再试！')
      }
      setUpDateLoading(false)
    }
  }
  return <WildcatForm
    ref={ref}
    config={config}
    loading={upDateLoading}
    formChange={handleChangeShow}
  />
}

export default forwardRef(BaseForm)
