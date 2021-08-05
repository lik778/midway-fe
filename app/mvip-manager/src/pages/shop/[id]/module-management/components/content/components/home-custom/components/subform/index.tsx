import React, { FC, forwardRef, Ref, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Form, FormInstance } from 'antd'

import WildcatForm from '@/components/wildcat-form';
import { CustomSetFormConfigFn } from './config';

import { FormConfig } from '@/components/wildcat-form/interfaces';
import { CustomerSetChildListItem } from '@/interfaces/shop';

import styles from './index.less'

const FormItem = Form.Item

interface Props {
  index: number,
  item: CustomerSetChildListItem,
  key: string,
  moduleID: number
  total: number
  onDel: (item: CustomerSetChildListItem) => void
}

const fontNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

const SubForm = (props: Props, parentRef: Ref<any>) => {
  const { item, index, onDel, total, moduleID } = props

  const ref = useRef<{ form: FormInstance | undefined }>({ form: undefined })
  useImperativeHandle(parentRef, () => ({
    form: ref.current.form,
    item
  }))

  // 上传图片被删除后需要重置字体颜色为黑色
  const imageChange = (value: string | undefined) => {
    if (!value) {
      ref.current.form?.setFieldsValue({
        fontColor: 0
      })
    }
  }
  const [config, setConfig] = useState<FormConfig>(() => CustomSetFormConfigFn({
    key: item.key,
    moduleID,
    imageChange
  }))
  const [editDataSource, setEditDataSource] = useState(() => ({
    ...item,
    fontColor: item.fontColor || 0
  }))

  const showDeleteBtn = useMemo(() => total > 2, [total])

  return <div className={styles['form-box']}>
    <FormItem
      className={styles['form-item']}
      label={<span className={styles['form-label']}>子模块{fontNumber[index]}</span>}
      required
      labelCol={{ span: 3 }}>
      <WildcatForm
        ref={ref}
        editDataSource={editDataSource}
        config={config}
      />
    </FormItem>
    {showDeleteBtn && (
      <div className={styles['form-delete']} onClick={() => onDel(item)}>删除</div>
    )}
  </div>
}

export default forwardRef(SubForm)
