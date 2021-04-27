import React, { FC, forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Form, FormInstance, Input, Radio } from 'antd'
import { CustomerSetFormConfigFn } from './config'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import WildcatForm from '@/components/wildcat-form';
import styles from './index.less'
import PreviewItem from '../preview/index'
import { CustomerSetChildListItem } from '@/interfaces/shop';

const FormItem = Form.Item

interface Props {
  index: number,
  item: CustomerSetChildListItem,
  onDel: (item: CustomerSetChildListItem) => void
  key: string,
  total: number
}

const fontNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

const CustomerSetForm = (props: Props, parentRef: Ref<any>) => {
  const { item, index, onDel, total } = props
  // 用于存储当时表单的值
  const [nowItem, setNowItem] = useState({
    ...item
  })
  // 为了获取子组件的form
  const ref = useRef<{ form: FormInstance | undefined }>({ form: undefined })
  // 将子组件的form给父组件
  useImperativeHandle(parentRef, () => ({
    form: ref.current.form
  }))

  // 上传图片被删除后需要重置字体颜色为黑色
  const imageChange = (value: string | undefined) => {
    if (!value) {
      ref.current.form?.setFieldsValue({
        fontColor: 'black'
      })
    }
  }

  const [config, setConfig] = useState<FormConfig>(() => CustomerSetFormConfigFn(item.key, imageChange))
  const [editDataSource, setEditDataSource] = useState(() => ({
    ...item,
    fontColor: item.fontColor || 'black'
  }))

  const RadioFormItem = useMemo(() => <FormItem label="字体颜色" name='fontColor' key='fontColor'>
    <Radio.Group disabled={nowItem.bgImg === ''}>
      <Radio style={{ marginRight: 44 }} value={'black'}>黑色<PreviewItem color="black"></PreviewItem></Radio>
      <Radio value={'white'}>白色 <PreviewItem color="white"></PreviewItem></Radio>
    </Radio.Group>
  </FormItem>, [nowItem])

  useEffect(() => {
    setConfig({
      ...config,
      customerFormItemList: RadioFormItem
    })
  }, [RadioFormItem])

  const formChange = (changeValue: any, allValues: any) => {
    setNowItem(allValues)
  }

  return <div className={styles['form-box']}>
    <FormItem className={styles['form-item']} label={<span className={styles['form-label']}>
      子模块{fontNumber[index]}
    </span>} required={true} labelCol={{ span: 3 }}>
      <WildcatForm
        ref={ref}
        editDataSource={editDataSource}
        config={config}
        formChange={formChange}
      />
    </FormItem>
    {
      total > 2 && <div className={styles['form-delete']} onClick={() => onDel(item)}>删除</div>
    }
  </div>
}

export default forwardRef(CustomerSetForm)