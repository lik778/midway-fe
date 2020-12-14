
import React from 'react';
import { Button } from 'antd';
import './index.less';
interface EmptyMsg {
  btn?: string,
  msg: string,
  img: string,
}
export default (props: {
  emptyMsg: EmptyMsg,
  onClick?: any,
}) => {
  const {btn ,msg, img} = props.emptyMsg
  return (
    <div className="empty-msg-box">
      <span className="empty-font iconfont">{img}</span>
      <Button type="primary" className="primary-btn" onClick={props.onClick}>+{btn}</Button>
    </div>
  );
}
