import React, { useEffect, FC, useState, useMemo } from 'react';
import WildcatForm from '@/components/wildcat-form';
import { ShopInfo } from '@/interfaces/shop';
import { getMetaSaveApi } from '@/api/shop';
import { ShopTDKPosition, ProductType, ShopTDKType } from '@/enums';
import { TdkDetail, TdkSaveMeta } from '@/interfaces/shop';
import { successMessage, errorMessage } from '@/components/message';
import { tdkForm } from './config'
import { getMetaDetailApi } from '@/api/shop';

interface Props {
  id: string,
  curShopInfo: ShopInfo | null
  pagePosition: ShopTDKPosition
  pageType: ShopTDKType
}

const SeoForm: FC<Props> = (props) => {
  const { id, curShopInfo, pagePosition, pageType } = props
  const [editData, setEditData] = useState<TdkDetail>()
  const [upDateLoading, setUpDateLoading] = useState<boolean>(false)
  const formConfig = useMemo(() => {
    return tdkForm(curShopInfo?.type === ProductType.B2B, pageType)
  }, [curShopInfo])

  const getMetaDetail = async () => {
    const res = await getMetaDetailApi(Number(id), {
      position: pagePosition!
    })
    if (res.success) {
      const tkd = res.data.tkd
      setEditData(tkd)
    } else {
      errorMessage(res.message)
    }
  }

  useEffect(() => {
    getMetaDetail()
  }, [])

  const sumbit = async (values: TdkSaveMeta) => {
    values.position = pagePosition
    values.title = (values.title || '').replace(/｜/g, '|')
    setUpDateLoading(true)
    const res = await getMetaSaveApi(Number(id), values)
    setUpDateLoading(false)
    if (res?.success) {
      successMessage('保存成功')
    } else {
      errorMessage(res.message)
    }
  }

  return <WildcatForm
    editDataSource={editData}
    config={formConfig}
    submit={sumbit}
    loading={upDateLoading} />
}
export default SeoForm
