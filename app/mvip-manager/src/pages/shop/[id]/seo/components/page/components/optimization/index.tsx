import React, { FC, useState, useMemo } from 'react';
import { ShopInfo } from '@/interfaces/shop';
import { optimizationMeta } from '@/api/shop';
import { getSeoCheckInfo, seoCheckInfoType, checkInfoStatus } from '@/api/seo-setting';
import { successMessage, errorMessage } from '@/components/message';
import SeoOptimizeTips from '../seo-optimize-tips'
import { Button } from 'antd';
import styles from './index.less'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  id: string,
  curShopInfo: ShopInfo | null
  onSubmitSuccess: () => void
}

const Optimization: FC<Props> = (props) => {
  const { id, curShopInfo, onSubmitSuccess } = props
  const [upDateLoading, setUpDateLoading] = useState<boolean>(false)
  const [seoCheckInfo, setSeoCheckInfo] = useState<seoCheckInfoType>()

  const sumbit = async () => {
    setUpDateLoading(true)
    const res = await optimizationMeta(Number(id))
    setUpDateLoading(false)
    if (res?.success) {
      successMessage('操作成功')
      onSubmitSuccess()
    } else {
      errorMessage(res.message)
    }
  }

  const getSeoCheckInfos = async () => {
    setUpDateLoading(true)
    const { data } = await getSeoCheckInfo(Number(id))
    setUpDateLoading(false)
    setSeoCheckInfo(data)
  }

  useEffect(() => {
    getSeoCheckInfos()
  }, [])

  switch(seoCheckInfo?.checkInfo.status){
      case checkInfoStatus.DEFAULT:
          return <>检测中</>;
    case checkInfoStatus.APPROVE:
        return <>检测通过</>;
    case checkInfoStatus.REJECT:
        return <>检测未通过</>;
    default:
        return <SeoOptimizeTips id={id} seoCheckInfo={seoCheckInfo}/>
  }
}

export default Optimization