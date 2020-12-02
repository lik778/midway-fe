
import React from 'react';
import './index.less';
import { Button } from 'antd';
export default (props: any) => {
  const config = props.btnConfig
  return (
    props.btnConfig && <Button type="primary" className="primary-btn" onClick={config.onClick}>+{config && config.text}</Button>
  );
}
