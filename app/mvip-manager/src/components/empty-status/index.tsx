
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
      <img className="img" src={img}/>
      <p className="msg">{msg}</p>
      {btn && <Button type="primary" className="primary-btn" onClick={props.onClick}>+{btn}</Button>}
    </div>
  );
}
