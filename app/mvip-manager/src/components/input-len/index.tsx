
import React from 'react';
import { Input } from 'antd';
import styles from './index.less';
import { useState, useEffect } from 'react';
interface inputItem {
  className?: string,
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
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
  useEffect(() => {
    setInitLength(value?.length || 0)
    setStateValue(value || '')
  }, [value])
  const [initLength, setInitLength] = useState<number>(value?.length || 0)
  const [stateValue, setStateValue] = useState<string>(value || '')
  const valueChange = (e: any) => {
    if(e.target){
        setInitLength(e.target?.value.length || 0)
        setStateValue(e.target?.value)
    }
    onChange && onChange(e)
  }
  const errorClass = isError ? 'input-error' : ''
  return (
    <div className={`${styles['il-module']} ${className}`} style={{ width: width }}>
      <Input value={stateValue} style={{ width: width }} onChange={valueChange} name={name} size={'large'} maxLength={maxLength} minLength={minLength} placeholder={placeholder} required={required} className={`${showCount ? styles['input'] : ''} ${errorClass}`} disabled={disabled} />
      {showCount && <span className={styles["f-num"]}>{initLength}/{maxLength}</span>}
    </div>
  );
}
