import React, { useState } from 'react'
import { Button, Statistic } from 'antd';
import { useAnimation } from '@/hooks/animation';
import { ReportLinkMap } from '@/constants/report';
import config from '@/config/env';

export default function CountTo(props: any) {
  const {
    type,
    title,
    from = 0,
    time = 1950,
    value : to = from,
    // TODO onFinish
  } = props
  const [displayNum, setDisplayNum] = useState<number>(from)
  useAnimation({ from, to, time, callback (nextVal: number) {
      setDisplayNum(nextVal)
    }})
  // 先写死，后面查看环境变量问题
  return <Statistic title={title} value={to === null ? '暂无数据' : displayNum}
        suffix={to === null && type && <Button target="_blank" href={`//www.baixing.com${ReportLinkMap[type]}`}>去开通</Button>}/>
}
