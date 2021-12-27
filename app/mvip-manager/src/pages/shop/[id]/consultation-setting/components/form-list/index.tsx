import React, { FC, useState } from 'react'
import { Form, Input, Button, Tag, Switch, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.less'
const FormList = Form.List
const FormItem = Form.Item
const MessageList: FC = () => {

  return <>
    <Form.Item
      className={styles['product-key-container']}
      label={'表单详情:'}
      key={'formInfo'}
    >
      <div className={styles['setting-tip']}
      >请输入参数名和参数值，例如"城市"，"输入你所在的城市"，
        <Tooltip color='#fff' placement="right" overlayInnerStyle={{ cursor: 'pointer' }} title={<img src="//file.baixing.net/202112/4520e5f513a8399b00c991af7f269c66.png" alt="logo" style={{ width: '100%', height: 263 }} />}>
          <QuestionCircleOutlined className={styles['parameter-example']} />
        </Tooltip >
      </div>
      {
        ['name', 'tel'].map(item => {
          return (
            <div className={styles['product-key-line']} key={item}>
              <FormItem className={styles['form-item']} name={[item, 'key']} initialValue={item === 'name' ? '姓名' : '联系方式'} key={item + 'key'}>
                <Input maxLength={6} className={styles['formItem']} disabled size="large" />
              </FormItem>
              <FormItem className={styles['form-item'] + ' ' + styles['form-value']} name={[item, 'value']} key={item + 'value'} rules={[{ required: false, message: item === 'name' ? '输入您的称呼' : '输入您的电话' }, { pattern: /^[\s\S]{2,20}$/, message: '2～20个字' }]}>
                <Input maxLength={20} className={styles['formItem']} placeholder="请输入" size="large" />
              </FormItem>
              <FormItem className={styles['form-swith']} key={item + 'switch'} valuePropName="checked" label="是否必填" name={[item, 'switch']}>
                <Switch disabled={item === 'tel' ? true : false} />
              </FormItem>
            </div>
          )
        })
      }
      <FormList name="params">
        {(fields, { add, remove }, { errors }) => (
          <>

            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <div
                className={styles['product-key-line']}
                key={key}
              >
                <FormItem className={styles['form-item']} name={[name, 'key']} fieldKey={[fieldKey, 'key']} rules={[{ required: true, message: '请输入' }, { pattern: /^[\s\S]{2,6}$/, message: '2～6个字' }]}>
                  <Input maxLength={6} className={styles['formItem']} placeholder={'请输入'} size="large" />
                </FormItem>
                <FormItem className={`${styles['form-item']} ${styles['form-value']}`} name={[name, 'value']} fieldKey={[fieldKey, 'value']} rules={[{ required: true, message: '请输入' }, { pattern: /^[\s\S]{2,20}$/, message: '2～20个字' }]}>
                  <Input maxLength={20} className={styles['formItem']} placeholder={'请输入'} size="large" />
                </FormItem>
                <FormItem className={styles['form-swith']} key={name + 'switch'} valuePropName="checked" label="是否必填" name={[name, 'switch']}>
                  <Switch />
                </FormItem>
                <span className={styles['delete']} onClick={() => remove(name)}>删除</span>
              </div>
            ))}
            {
              fields && fields.length < 3 && <Button className={styles['add']} type="primary" onClick={() => add()} >+添加</Button>
            }
          </>
        )}
      </FormList>
      <div className={styles['red-tip']}>
        注：您最多可以自定义3个参数，参数名不超过6个字符，参数值不超过20个字符
      </div>
    </Form.Item>
  </>
}

export default MessageList