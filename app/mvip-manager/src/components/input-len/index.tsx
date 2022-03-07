
import React from 'react';
import { Input } from 'antd';
import styles from './index.less';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
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
  const { onChange, name, maxLength = 0, minLength, required, isError, placeholder, width, disabled, showCount, className } = props
  const [initLength, setInitLength] = useState<number>(0)
  const valueChange = (e, cb) => {
    if(e.target){
        setInitLength(e.target?.value.length || 0)
    }
    cb && cb(e)
  }
  const errorClass = isError ? 'input-error' : ''
  return (
    <div className={`${styles['il-module']} ${className}`} style={{ width: width }}>
      <Input style={{ width: width }} onChange={(e) => valueChange(e, onChange)} name={name} size={'large'} maxLength={maxLength} placeholder={placeholder} minLength={minLength} required={required} className={`${showCount ? styles['input'] : ''} ${errorClass}`} disabled={disabled} />
      {showCount && <span className={styles["f-num"]}>{initLength}/{maxLength}</span>}
    </div>
  );
}
