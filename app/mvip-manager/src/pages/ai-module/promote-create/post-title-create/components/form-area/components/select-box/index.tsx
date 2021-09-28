import React, { FC, forwardRef, Ref, useEffect, useState, useImperativeHandle, useMemo, useCallback } from 'react';
import { Form, Checkbox } from 'antd';
import { SelectConfig, SelectListItem } from '../../../../data'
import styles from './index.less';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group

interface Props {
  value?: SelectListItem[],
  onChange?: (value: SelectListItem[]) => void,
  name: string,
  selectList: SelectListItem[],
  selectAll: boolean
  onValueChange: (name: string, value: SelectListItem[]) => void,
}

const SelectBox = (props: Props, parentRef: Ref<any>) => {

  const { value, onChange, name, selectList, onValueChange } = props

  const localValue = useMemo(() => (value || []).map(item => item.value), [value])

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

  const onCheckAllChange = useCallback((checkAll: boolean) => {
    const newValue = checkAll ? selectList.map(item => ({
      label: item.label,
      value: item.value
    })) : []
    onChange!(newValue)
    onValueChange(name, newValue)
  }, [selectList])

  const onCheckChange = (checkValue: any[]) => {
    const checkValueMap: Map<string, boolean> = new Map()
    checkValue.forEach(item => {
      checkValueMap.set(item, true)
    })
    const newValue = selectList.filter(item => checkValueMap.has(item.value)).map(item => ({
      label: item.label,
      value: item.value
    }))
    onChange!(newValue)
    onValueChange(name, newValue)
  }

  return <div className={`${styles['select-container']} select-container`}>
    <CheckboxGroup value={localValue} onChange={onCheckChange}>
      {
        (selectList || []).map(item => <div className={styles['select-item']} key={item.value}>
          <Checkbox value={item.value}>{item.label}</Checkbox>
        </div>)
      }
    </CheckboxGroup>
  </div>
}

export default forwardRef(SelectBox)