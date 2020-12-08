
import React from 'react';
import { Input } from 'antd';
import './index.less';
export default (props: any) => {
  return (
    <Input value={props?.value} />
  );
}
