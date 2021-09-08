import React, { FC, useState, useEffect } from 'react';
import { Form } from 'antd'
import TargetComponent from './components/target-component'
import { selectItemConfig } from './config'
import styles from './index.less'
import { ConfigItem, ConfigKey } from './data'

interface Props {
  itemMaxLength?: number,
  className?: string,
  configKey: ConfigKey
}

const SelectItem: FC<Props> = (props) => {
  const { className, configKey, itemMaxLength } = props
  const [componentConfig] = useState<ConfigItem>({
    ...selectItemConfig[configKey],
    maxLength: itemMaxLength || selectItemConfig[configKey].maxLength
  })
  return <Form.Item className={className} label={componentConfig.label} name={componentConfig.name} required={componentConfig.required} rules={componentConfig.rules}>
    <TargetComponent componentConfig={componentConfig}></TargetComponent>
  </Form.Item>
}

export default SelectItem