
import React from 'react';
import { Input } from 'antd';
import './index.less';
interface inputItem {
  value?: string;
  onChange?:any;
  maxLength?: number;
  initLength?:number;
  name?:string | undefined;
}
export default (props: inputItem) => {
  const {value, onChange, name, maxLength} = props
  const initLength = value?.length || 0
  return (
    <div className="il-module">
        <Input value={value} onChange={onChange} name={name} maxLength={maxLength}/>
        <span className="f-num">{initLength}/{maxLength}</span>
    </div>
  );
}
