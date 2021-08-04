import React, { FC, useState, useEffect } from 'react';
import { Form } from 'antd'
import styles from './index.less'
interface Props {
  value?: number[]; // Form.Item提供
  onChange?: (value: number[]) => void; // Form.Item提供
}

const SelectModal: FC<Props> = (props) => {
  const { value, onChange } = props

  return <div>123</div>
}

export default SelectModal