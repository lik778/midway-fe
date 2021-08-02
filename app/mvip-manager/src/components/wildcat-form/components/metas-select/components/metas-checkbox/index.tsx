import React, { useState, useEffect, FC, useMemo } from 'react';
import { Checkbox } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { MetasItem } from '@/interfaces/user';
import { FormItem, OptionItem } from '@/components/wildcat-form/interfaces';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader'
import { getSecondCategoryMetas, getThirdCategoryMetas } from '@/api/user'
import { mockData, objToTargetObj } from '@/utils';
import { ShopMetas } from '@/interfaces/user'

const CheckboxGroup = Checkbox.Group

interface Props {
  item: FormItem,
  initialValues: ShopMetas | undefined,
  cascaderValue: (MetasItem | undefined)[],
  handleChangeCheckboxValue: (value: string[]) => void // 通知父组件
  value?: any,
  onChange?: (value: string[]) => void, // 更新from表单的值
  setThirdDataLength: (length: number | undefined) => void
}

const MetasCheckbox: FC<Props> = (props) => {
  const { item, initialValues, cascaderValue, handleChangeCheckboxValue, value, onChange, setThirdDataLength } = props
  const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
  // 缓存一下请求数据
  const [thirdMates, setThirdMates] = useState<{
    [key: string]: MetasItem[]
  }>({})

  const [showData, setShowData] = useState<MetasItem[]>([])

  const changeData = (third: string[]) => {
    handleChangeCheckboxValue(third)
    onChange!(third)
    setCheckboxValue(third)
  }

  // 仅用于初始值
  const initValues = () => {
    if (initialValues) {
      const third = initialValues[2]
      if (third) {
        changeData(third)
      }
    }
  }

  useEffect(() => {
    // 这里用定时器延时是因为cascaderValue更新会清空当前的选中值，所以做个延时，保证初始化这个动作在整个组件最后再初始化
    setTimeout(() => {
      initValues()
    }, 0)
  }, [initialValues])

  // 当选择器的值变化触发
  useEffect(() => {
    changeData([])
    if (cascaderValue[1]) {
      if (thirdMates[cascaderValue[1].value]) {
        setShowData(thirdMates[cascaderValue[1].value])
        setThirdDataLength(thirdMates[cascaderValue[1].value].length)
      } else {
        handleChangeSecondMates(cascaderValue[1].value)
      }
    } else {
      setShowData([])
    }
  }, [cascaderValue])

  //获取三级类目meta
  const handleChangeSecondMates = async (catogoryName: any) => {
    setThirdDataLength(undefined)
    const res = await getThirdCategoryMetas(catogoryName);
    if (res?.success) {
      const newShopData = objToTargetObj(res.data, "label")
      setThirdMates({
        ...thirdMates,
        [catogoryName]: newShopData
      })
      setShowData(newShopData)
      setThirdDataLength(newShopData.length)
    }
  }

  const handleChangeValue = async (checkedValue: CheckboxValueType[]) => {
    setCheckboxValue(checkedValue as string[])
    onChange!(checkedValue as string[])
    handleChangeCheckboxValue(checkedValue as string[])
  }

  return <CheckboxGroup value={checkboxValue} onChange={handleChangeValue} options={showData} />
}

export default MetasCheckbox