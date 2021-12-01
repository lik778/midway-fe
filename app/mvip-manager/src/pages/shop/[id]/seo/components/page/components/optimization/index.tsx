import React, { FC, useState, useMemo } from 'react';
import { ShopInfo } from '@/interfaces/shop';
import { optimizationMeta } from '@/api/shop';
import { successMessage, errorMessage } from '@/components/message';
import { Button } from 'antd';
import styles from './index.less'

interface Props {
  id: string,
  curShopInfo: ShopInfo | null
  onSubmitSuccess: () => void
}

const Optimization: FC<Props> = (props) => {
  const { id, curShopInfo, onSubmitSuccess } = props
  const [upDateLoading, setUpDateLoading] = useState<boolean>(false)

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

  return <>
    <Button className={styles['btn']} type="primary" onClick={sumbit} disabled={(!curShopInfo?.canOptimizeFlag) || upDateLoading} loading={upDateLoading}>一键优化</Button>
    <p className={styles['tip']}>注：1.店铺新建产品分组、产品页才可再次一键优化 2.一键优化后3天后可通过营销报表查看上词。</p>
  </>
}

export default Optimization