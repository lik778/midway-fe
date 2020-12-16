import React from 'react';
import { Space, Spin } from 'antd';
import './index.less';

export default () => {
  return (
      <Space size="middle">
        <Spin size="large"/>
        <p>加载中...</p>
      </Space>
    )
}
