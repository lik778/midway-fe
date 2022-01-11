import React, { useState, useEffect, FC } from 'react';
import { Form } from 'antd'
import { FormItem, } from '../../interfaces/index'
import { MetasItem, } from '@/interfaces/user'
import MetasCascader from './components/metas-cascader'
import MetasCheckbox from './components/metas-checkbox'
import Metas from './components/metas'
import { ShopMetas } from '@/interfaces/user'
// 三级类目选择
const MetasSelect: FC<{
  disabled?: boolean,
  item: FormItem,
  initialValues: ShopMetas | undefined,
  onChange: (value: any, key: 'metas' | 'metaCascader' | 'metaCheckbox') => void
  showSelectAll?: boolean
}> = (props) => {
  const { item, initialValues, onChange, disabled, showSelectAll = false } = props
  const [cascaderValue, setCascaderValue] = useState<(MetasItem | undefined)[]>([]);
  const [checkboxValue, setCheckboxValue] = useState<string[]>([])
  // undefined说明组件数据还没请求到最新数据，三级类目数据可以为空，此时长度为0，需要隐藏且非必填
  const [thirdDataLength, setThirdDataLength] = useState<number | undefined>(undefined)
  // 全选功能
  useEffect(() => {
    if (cascaderValue.length === 0) {
      setThirdDataLength(0)
    }
    onChange([cascaderValue[0], cascaderValue[1], checkboxValue], 'metas')
  }, [cascaderValue, checkboxValue])

  return <>
    <Form.Item className={item.className} label='类目' key='类目' rules={[{ required: item.required, message: '请选择类目' }]} labelCol={item.labelCol} name='metaCascaderValue'>
      <MetasCascader disabled={disabled} item={item} initialValues={initialValues} handleChangeCascaderValue={setCascaderValue}></MetasCascader>
    </Form.Item>
    <Form.Item style={cascaderValue.length >= 0 && thirdDataLength && thirdDataLength > 0 ? {} : {
      display: 'none'
    }} className={item.className} label='服务内容' key='服务内容' rules={[{ required: thirdDataLength === 0 ? false : item.required, message: '请选择服务内容' }]} labelCol={item.labelCol} name='metaCheckbox'>
      <MetasCheckbox disabled={disabled} item={item} initialValues={initialValues} cascaderValue={cascaderValue} handleChangeCheckboxValue={setCheckboxValue} setThirdDataLength={setThirdDataLength} showSelectAll={showSelectAll}></MetasCheckbox>
    </Form.Item>
    {/*  用于存储metas字段的FormItem */}
    <Form.Item style={{
      display: 'none'
    }} key='metas' name={item.name}>
      <Metas cascaderValue={cascaderValue} checkboxValue={checkboxValue}></Metas>
    </Form.Item>
  </>

}

export default MetasSelect