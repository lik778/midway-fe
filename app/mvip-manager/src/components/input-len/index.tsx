
import React from 'react';
import { Input } from 'antd';
import './index.less';
interface inputItem {
  value?: string;
  onChange?:any;
  maxLength?: number;
  initLength?:number;
  name?:string | undefined;
  minLength?: number;
  required?: boolean;
  isError?: boolean;
}
export default (props: inputItem) => {
  const {value, onChange, name, maxLength, minLength, required, isError} = props
  const initLength = value?.length || 0
  const className = isError? 'input-error': ''
  return (
    <div className="il-module">
        <Input value={value} onChange={onChange} name={name} maxLength={maxLength} minLength={minLength} required={required} className={className}/>
        <span className="f-num">{initLength}/{maxLength}</span>
    </div>
  );
}
