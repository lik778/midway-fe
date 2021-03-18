import React, { useState } from 'react'
import { Button, Statistic } from 'antd';
import { useAnimation } from '@/hooks/animation';
import { ReportLinkMap } from '@/constants/report';
// import config from '@/config/env';

export default function CountTo(props: any) {
  const {
    type,
    title,
    isSub,
    from = 0,
    time = 1150,
    value : to = from,
    // TODO onFinish event
  } = props
  const [displayNum, setDisplayNum] = useState<number>(from)
  useAnimation({ from, to, time, callback (nextVal: number) {
      setDisplayNum(nextVal)
    }})
  const notOpen = to === null;
  const showOpenBtn  = notOpen && type;
  // const haojingHost = config().env;
  const haojingHost = '//www.baixing.com';
  // 先写死，后面查看环境变量问题
  return <div>
    <Statistic className={isSub ? 'report-sub-statistic' : ''} title={title} value={notOpen ? '' : displayNum}
     valueStyle={{ display: showOpenBtn ? 'none' : ''  }} />
    { showOpenBtn && <div>
    <p style={{ height: 50, lineHeight: '50px' }}>暂无数据</p>
    <Button target="_blank" href={`${ haojingHost }${ReportLinkMap[type]}`}>去开通</Button>
  </div> }
  </div>
}
