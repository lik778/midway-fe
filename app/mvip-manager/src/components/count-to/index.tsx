import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Statistic } from 'antd'

import { useAnimation } from '@/hooks'

export default function CountTo(props: any) {
  const {
    title,
    from = 0,
    time = 500,
    value : to = from,
    // TODO onFinish
  } = props

  const [displayNum, setDisplayNum] = useState<number>(from)

  useAnimation({ from, to, time, callback (nextVal: number) {
    // console.log('test auto stop')
    setDisplayNum(nextVal)
  }})

  return <Statistic title={title} value={displayNum} />
}
