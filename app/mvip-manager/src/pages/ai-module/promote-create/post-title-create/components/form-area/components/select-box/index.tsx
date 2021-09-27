import React, { FC, forwardRef, Ref, useEffect, useState, useImperativeHandle } from 'react';
import { Form, Checkbox } from 'antd';
import { SelectConfig, SelectListItem } from '../../data'
import styles from './index.less';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group

interface Props {
  value?: string[],
  onChange?: (value: string[]) => void,
  name: string,
  selectList: SelectListItem[],
  selectAll: boolean
  onValueChange: (name: string, value: string[]) => void,
}

const SelectBox = (props: Props, parentRef: Ref<any>) => {

  const { value, onChange, name, selectList, onValueChange } = props

  // 是否有操作过， 操作过才会显示警告边框 
  const [first, setFirst] = useState<boolean>(true)

  useImperativeHandle(parentRef, () => ({
    onCheckAllChange
  }), [])

  // 选择项更新则清空选择项
  useEffect(() => {
    if (name === 'area') {
      onChange!([])
      onValueChange(name, [])
    }
  }, [selectList])

  const onCheckAllChange = (checkAll: boolean) => {
    const newValue = checkAll ? selectList.map(item => item.value) : []
    onChange!(newValue)
    onValueChange(name, newValue)
  }

  const onCheckChange = (checkValue: any[]) => {
    setFirst(false)
    onChange!(checkValue)
    onValueChange(name, checkValue)
  }

  return <div className={`${styles['select-container']} select-container`}>
    <CheckboxGroup value={value} onChange={onCheckChange}>
      {
        selectList.map(item => <div className={styles['select-item']} key={item.value}>
          <Checkbox value={item.value}>{item.label}</Checkbox>
        </div>)
      }
    </CheckboxGroup>
  </div>
}

export default forwardRef(SelectBox)