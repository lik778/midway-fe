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
  moduleID: string
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

  const [config, setConfig] = useState<FormConfig>(() => CustomSetFormConfigFn({
    key: item.key,
    moduleID
  }))

  const [editDataSource, setEditDataSource] = useState({
    ...item,
  })

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
