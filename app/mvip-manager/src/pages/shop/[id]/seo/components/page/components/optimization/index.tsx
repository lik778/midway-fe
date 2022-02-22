import React, { FC, useState, useCallback } from 'react';
import { ShopInfo } from '@/interfaces/shop';
import { optimizationMeta } from '@/api/shop';
import { getSeoCheckInfo, seoCheckInfoType, checkInfoStatus, submitSeoCheck } from '@/api/seo-setting';
import { successMessage, errorMessage } from '@/components/message';
import SeoOptimizeTips from '../seo-optimize-tips'
import { Modal, Button } from 'antd';
import { useEffect } from 'react';
import SeoAuditIng from '../seo-audit-ing';
const { confirm } = Modal;

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

    const submitCheck = useCallback(async () => {
        try {
            await submitSeoCheck(Number(id))
            await getSeoCheckInfos()
            confirm({
                title: '温馨提示',
                content: '为了保证您的SEO效果，预计在24小时内完成检测，请耐心等待！',
                onOk() {
                  console.log('OK');
                },
                onCancel() {
                  console.log('Cancel');
                },
            });
        } catch (error) {
            console.log(error)
        }
    }, [])

    return <>
        { seoCheckInfo?.checkInfo.status ? <SeoAuditIng seoCheckInfo={seoCheckInfo}/> : <SeoOptimizeTips seoCheck={submitCheck} id={id} seoCheckInfo={seoCheckInfo}/> }
        { seoCheckInfo?.checkInfo.status && seoCheckInfo?.checkInfo.status === checkInfoStatus.APPROVE && <Button type="primary" onClick={sumbit} disabled={!curShopInfo?.canOptimizeFlag}>一键优化</Button>}
        { seoCheckInfo?.checkInfo.status && seoCheckInfo?.checkInfo.status === checkInfoStatus.REJECT && <Button type="primary" onClick={submitCheck}>立即检测</Button>}
    </>
}

export default Optimization