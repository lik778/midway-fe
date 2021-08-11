import React, { CSSProperties } from 'react';
import { Spin } from 'antd';
import './index.less';

type Props = {
  toast?: boolean
  prevent?: boolean
}
export default (props: Props) => {
  const { prevent, toast } = props
  return (
    <div className={"management-common-loading" + ' ' + (prevent ? 'prevent' : '') + ' ' + (toast ? 'toast' : '')}>
      <div className="inner">
        <Spin size="large"/>
        <p>加载中...</p>
      </div>
    </div>
    )
}
