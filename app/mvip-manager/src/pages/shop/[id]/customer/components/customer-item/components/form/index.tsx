import React, { FC, forwardRef, Ref, useEffect, useMemo, useState } from 'react'
import { Form, Input, Radio } from 'antd'
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
  const [itemData, setItemData] = useState<CustomerSetChildListItem>(item)
  const [config, setConfig] = useState<FormConfig>(() => CustomerSetFormConfigFn(item.key))
  const [editDataSource, setEditDataSource] = useState(() => ({
    ...item,
    fontColor: item.fontColor || 'black'
  }))

  const RadioFormItem = <FormItem label="字体颜色" name='fontColor' key='fontColor'>
    <Radio.Group >
      <Radio style={{ marginRight: 44 }} value={'black'}>黑色<PreviewItem color="black"></PreviewItem></Radio>
      <Radio value={'white'}>白色 <PreviewItem color="white"></PreviewItem></Radio>
    </Radio.Group>
  </FormItem>

  useEffect(() => {
    setConfig({
      ...config,
      customerFormItemList: RadioFormItem
    })
  }, [])


  const formChange = (changeValue: any, allValues: any) => {
    setItemData({
      ...allValues
    })
  }

  return <div className={styles['form-box']}>
    <FormItem className={styles['form-item']} label={<span className={styles['form-label']}>
      子模块{fontNumber[index]}
    </span>} required={true} labelCol={{ span: 2 }}>
      <WildcatForm
        ref={parentRef}
        editDataSource={editDataSource}
        config={config}
        formChange={formChange}
      />
    </FormItem>
    {
      total > 2 && <div className={styles['form-delete']} onClick={() => onDel(item)}>删除优势</div>
    }
  </div>
}

export default forwardRef(CustomerSetForm)