import React, { FC, useState, useMemo, useEffect, useRef } from 'react';
import { FormInstance, Button, Tag } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { PlusOutlined } from '@ant-design/icons'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { ShopInfo, TdkSaveAreaSuffix } from '@/interfaces/shop';
import { saveMateAreaSuffix } from '@/api/shop';
import { successMessage, errorMessage } from '@/components/message';
import { tdkForm } from './config'
import styles from './index.less'

interface Props {
  id: string,
  curShopInfo: ShopInfo | null,
  onSubmitSuccess: () => void
}

const publicSuffix = ['品牌', '价格', '批发', '图片', '行情', '地址', '厂家', '公司', '货源', '参数', '电话']

const SeoForm: FC<Props> = (props) => {
  const { id, curShopInfo, onSubmitSuccess } = props
  const [upDateLoading, setUpDateLoading] = useState<boolean>(false)
  const editData = useMemo<TdkSaveAreaSuffix>(() => ({
    areas: curShopInfo?.tkdCommonParams.areas || [],
    suffixs: curShopInfo?.tkdCommonParams.suffixs || [],
  }), [curShopInfo])

  const formRef = useRef<{
    form: FormInstance | null
  }>({ form: null })

  const sumbit = async (values: TdkSaveAreaSuffix) => {
    setUpDateLoading(true)
    const res = await saveMateAreaSuffix(Number(id), values)
    setUpDateLoading(false)
    if (res?.success) {
      successMessage('保存成功')
      onSubmitSuccess()
    } else {
      errorMessage(res.message)
    }
  }


  const handleClickAddPublic = () => {
    if (formRef.current.form) {
      const { suffixs } = formRef.current.form?.getFieldsValue()
      let newSuffixs = [...new Set((suffixs && suffixs.length > 0 ? suffixs : []).concat(publicSuffix))]
      formRef.current.form.setFieldsValue({
        suffixs: newSuffixs
      })
    }
  }

  const [config] = useState<FormConfig>(tdkForm(
    <Tag className={styles['add-btn']} onClick={handleClickAddPublic} >
      <PlusOutlined /> 通用后缀
    </Tag>
  ))

  return <WildcatForm
    ref={formRef}
    editDataSource={editData}
    config={config}
    submit={sumbit}
    loading={upDateLoading} />
}
export default SeoForm
