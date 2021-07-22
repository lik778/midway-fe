import React, { useState, useEffect, FC, useMemo } from 'react';
import { Form, Cascader, } from 'antd'
import { FormItem, } from '../../interfaces/index'
import { MetasItem, } from '@/interfaces/user'
import MetasCascader from './components/metas-cascader'
import MetasCheckbox from './components/metas-checkbox'
import { ShopMetas } from '@/interfaces/user'
// 三级类目选择
const MetasSelect: FC<{
  item: FormItem,
  initialValues: ShopMetas | undefined,
  onChange: (value: any, key: 'metas' | 'metaCascader' | 'metaCheckbox') => void
}> = (props) => {
  const { item, initialValues, onChange } = props
  const [cascaderValue, setCascaderValue] = useState<(MetasItem | undefined)[]>([]);
  const [checkboxValue, setCheckboxValue] = useState<string[]>([])
  useEffect(() => {
    onChange([cascaderValue[0], cascaderValue[1], checkboxValue], 'metas')
  }, [cascaderValue, checkboxValue])

  return <>
    <Form.Item className={item.className} label='类目' key='类目' rules={[{ required: item.required, message: '请选择类目' }]} labelCol={item.labelCol} name='metaCascaderValue'>
      <MetasCascader item={item} initialValues={initialValues} handleChangeCascaderValue={setCascaderValue}></MetasCascader>
    </Form.Item>
    <Form.Item style={cascaderValue.length === 0 ? {
      display: 'none'
    } : {}} className={item.className} label='服务内容' key='服务内容' rules={[{ required: item.required, message: '请选择服务内容' }]} labelCol={item.labelCol} name='metaCheckbox'>
      <MetasCheckbox item={item} initialValues={initialValues} cascaderValue={cascaderValue} handleChangeCheckboxValue={setCheckboxValue}></MetasCheckbox>
    </Form.Item>

    {/*  用于存储metas字段的FormItem */}
    <Form.Item style={{
      display: 'none'
    }} key='metas' name={item.name}>
      <div></div>
    </Form.Item>
  </>

}

export default MetasSelect