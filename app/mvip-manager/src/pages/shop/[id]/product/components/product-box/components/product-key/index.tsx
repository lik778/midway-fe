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
  const [showElem, setShowElem] = useState(false)
  const mouseover = () => {
    setShowElem(true)
  }
  const mouseout = () => {
    setShowElem(false)
  }
  return <>
    <Form.Item
      className={styles['product-key-container']}
      label={'参数:'}
      required={true}
      key={'params'}
    >
      <p className={styles['setting-tip']}
      >输入参数名和参数值，例如"品牌"，"奥迪"，<span className={styles['tip-img']} onMouseOver={mouseover} onMouseOut={mouseout}>参数示意</span>
        <span className={styles['imgs-tips']}>
          <img style={{ display: showElem ? 'block' : 'none' }} src="//file.baixing.net/202109/18cfbd879b579812ea7d146a56e9bc37.png" alt="logo" />
        </span>
      </p>
      <FormList name="params">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <div
                className={styles['product-key-line']}
                key={key}
              >
                <FormItem className={styles['form-item']} name={[name, 'key']} fieldKey={[fieldKey, 'key']} rules={[{ required: true, message: '请输入' }, { pattern: /^[\s\S]{2,10}$/, message: '2～10个字' }]}>
                  <Input maxLength={10} className={styles['formItem']} placeholder={index === 0 ? '品牌' : (index === 1 ? '型号' : '')} size="large" />
                </FormItem>
                <FormItem className={styles['form-item']} name={[name, 'value']} rules={[{ required: true, message: '请输入' }, { pattern: /^[\s\S]{2,50}$/, message: '2～50个字' }]}>
                  <Input maxLength={50} className={styles['formItem']} size="large" />
                </FormItem>
                {
                  fields.length > 2 && <span className={styles['delete']} onClick={() => remove(name)}>删除</span>
                }
              </div>
            ))}
            {
              fields && fields.length <= 7 && <span className={styles['add']} onClick={() => add()} ><PlusOutlined color={'#333333'} />添加参数</span>
            }
          </>
        )}
      </FormList>
    </Form.Item>

  </>
}

export default ProductKey