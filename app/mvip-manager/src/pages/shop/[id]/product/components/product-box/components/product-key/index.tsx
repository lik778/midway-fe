import React, { FC, useState, } from 'react';
import { Form, Input, Button } from 'antd'
import styles from './index.less'
import { useDebounce } from '@/hooks/debounce'
import { ProductListItem, ProductListItemInfoKey } from '@/interfaces/shop';
import { PlusOutlined } from '@ant-design/icons'

interface Props {

}
const FormList = Form.List
const FormItem = Form.Item

const ProductKey: FC<Props> = (props) => {
  return <>
    <Form.Item
      className={styles['product-key-container']}
      label={'添加参数'}
      required={true}
      key={'params'}
    >
      <FormList name="params">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <div
                className={styles['product-key-line']}
                key={key}
              >
                <FormItem className={styles['form-item']} name={[name, 'key']} fieldKey={[fieldKey, 'key']} rules={[{ required: true, message: '请输入标题' }, { pattern: /^[\s\S]{2,10}$/, message: '2～10个字' }]}>
                  <Input maxLength={10} className={styles['formItem']} placeholder="请输入内容" size="large" />
                </FormItem>
                <FormItem className={styles['form-item']} name={[name, 'value']} rules={[{ required: true, message: '请输入内容' }, { pattern: /^[\s\S]{2,50}$/, message: '2～50个字' }]}>
                  <Input maxLength={50} className={styles['formItem']} placeholder="请输入内容" size="large" />
                </FormItem>
                {
                  fields.length > 2 && <span className={styles['delete']} onClick={() => remove(name)}>删除</span>
                }
              </div>
            ))}
            {
              fields && fields.length <= 7 && <span className={styles['add']} onClick={() => add()} ><PlusOutlined color={'#333333'} />添加</span>
            }
          </>
        )}
      </FormList>
    </Form.Item>

  </>
}

export default ProductKey