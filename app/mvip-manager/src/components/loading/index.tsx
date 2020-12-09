import React from 'react';
import { Spin } from 'antd';
import './index.less';

export default () => {
  return (
    <div className="management-loading">
      <div className="inner">
        <Spin />
        <p>加载中...</p>
      </div>
    </div>
    )
}
