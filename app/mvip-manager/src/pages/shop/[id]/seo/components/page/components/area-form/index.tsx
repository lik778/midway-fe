import React, { FC, useState, useMemo } from 'react';
import { connect } from 'dva';
import WildcatForm from '@/components/wildcat-form';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE } from '@/models/shop';
import { ShopInfo, TdkSaveAreaSuffix } from '@/interfaces/shop';
import { saveMateAreaSuffix } from '@/api/shop';
import { successMessage, errorMessage } from '@/components/message';
import { tdkForm } from './config'

interface Props {
  id: string,
  curShopInfo: ShopInfo | null,
  onSubmitSuccess: () => void
}

const SeoForm: FC<Props> = (props) => {
  const { id, curShopInfo, onSubmitSuccess } = props
  const [upDateLoading, setUpDateLoading] = useState<boolean>(false)
  const editData = useMemo<TdkSaveAreaSuffix>(() => ({
    areas: curShopInfo?.tkdCommonParams.areas || [],
    suffixs: curShopInfo?.tkdCommonParams.suffixs || [],
  }), [curShopInfo])

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

  return <WildcatForm
    editDataSource={editData}
    config={tdkForm}
    submit={sumbit}
    loading={upDateLoading} />
}
export default SeoForm
