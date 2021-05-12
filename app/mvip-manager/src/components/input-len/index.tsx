
import React from 'react';
import { Input } from 'antd';
import './index.less';
interface inputItem {
  className?: string,
  value?: string;
  onChange?: any;
  maxLength?: number;
  initLength?: number;
  name?: string | undefined;
  minLength?: number;
  required?: boolean;
  isError?: boolean;
  width?: number | string;
  placeholder?: string;
  disabled?: boolean;
  showCount?: boolean;
}
export default (props: inputItem) => {
  const { value, onChange, name, maxLength, minLength, required, isError, placeholder, width, disabled, showCount, className } = props
  const initLength = value?.length || 0
  const errorClass = isError ? 'input-error' : ''
  return (
    <div className= {`il-module ${className}`} style={{ width: width }}>
      <Input value={value} style={{ width: width }} onChange={onChange} name={name} size={'large'} maxLength={maxLength} placeholder={placeholder} minLength={minLength} required={required} className={errorClass} disabled={disabled} />
      {showCount && <span className="f-num">{initLength}/{maxLength}</span>}
    </div>
  );
}
