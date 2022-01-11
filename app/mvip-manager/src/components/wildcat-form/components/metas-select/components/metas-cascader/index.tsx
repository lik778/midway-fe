import React, { useState, useEffect, FC, useMemo } from 'react';
import { Form, Cascader, } from 'antd'
import { MetasItem } from '@/interfaces/user';
import { FormItem, SelectOptionItem } from '@/components/wildcat-form/interfaces';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader'
import { getSecondCategoryMetas, getThirdCategoryMetas } from '@/api/user'
import { mockData, objToTargetObj } from '@/utils';
import { ShopMetas } from '@/interfaces/user'

interface Props {
  disabled?: boolean
  item: FormItem,
  initialValues: ShopMetas | undefined,
  handleChangeCascaderValue: (value: (MetasItem | undefined)[]) => void // 通知父组件
  value?: any,
  onChange?: (value: MetasItem[]) => void, // 更新from表单的值
}

const MetasCascader: FC<Props> = (props) => {
  const { disabled, item, initialValues, value, onChange, handleChangeCascaderValue } = props
  const { options } = item // 解构出一级meta的数据结构
  const [cascaderOptions, setCascaderOptions] = useState<CascaderOptionType[]>([])
  const [cascaderValue, setCascaderValue] = useState<string[]>([]);

  // 仅用于初始值
  const initValues = () => {
    if (initialValues) {
      const first = initialValues[0]
      const second = initialValues[1]
      if (first && second) {
        handleChangeCascaderValue([first, second])
        onChange!([first, second])
        setCascaderValue([first.key, second.key])
      }
    }
  }

  useEffect(() => {
    initValues()
  }, [initialValues])

  // 初始化选择器
  const initCascaderOptions = () => {
    if (!options) return
    setCascaderOptions(() => (options as SelectOptionItem[]).map(item => ({
      ...item,
      label: item.key,
      isLeaf: false,
      children: item.children && item.children.map(citem => ({
        label: citem.key,
        value: citem.value
      }))
    })))
  }

  useEffect(() => {
    initCascaderOptions()
  }, [options])

  const loadData = async (selectedOptions?: CascaderOptionType[]) => {
    if (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true;
      const res = await getSecondCategoryMetas(selectedOptions[0].value)
      targetOption.loading = false;
      targetOption.children = objToTargetObj(res.data, "label")
      setCascaderOptions([...cascaderOptions]);
    }
  }


  const handleChangeValue = async (value: CascaderValueType, selectedOptions?: CascaderOptionType[] | undefined) => {
    setCascaderValue(value as string[])
    const newCascaderValue = (selectedOptions || []).map(item => ({
      key: item.label,
      value: item.value,
      label: item.label
    } as MetasItem))
    onChange!(newCascaderValue)
    handleChangeCascaderValue(newCascaderValue)
  }

  return <Cascader disabled={disabled} style={{ width: item.formItemWidth }} options={cascaderOptions} loadData={loadData} value={cascaderValue} onChange={handleChangeValue}></Cascader>
}

export default MetasCascader