import React, { FC, useState, useEffect } from 'react';
import { Form } from 'antd'
import TargetComponent from './components/target-component'
import { selectItemConfig } from './config'
import styles from './index.less'
import { ConfigItem } from './data'

interface Props {
  className?: string,
  configKey: string
}

const SelectItem: FC<Props> = (props) => {
  const { className, configKey } = props
  const [componentConfig] = useState<ConfigItem>(selectItemConfig[configKey])
  return <Form.Item className={className} label={componentConfig.label} name={componentConfig.name} required={componentConfig.required} rules={componentConfig.rules}>
    <TargetComponent componentConfig={componentConfig}></TargetComponent>
  </Form.Item>
}

export default SelectItem