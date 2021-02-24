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
  return <Statistic title={title} value={to === null ? (type ? '暂未开通' : '-') : displayNum}
        suffix={to === null && type && <Button target="_blank" href={`${config().haojing}${ReportLinkMap[type]}`}>去开通</Button>}/>
}
