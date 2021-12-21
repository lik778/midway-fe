import React, { FC, useState } from 'react'
import { Form, Input, Button, Tag, Switch, Tooltip } from 'antd'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.less'
const FormList = Form.List
const FormItem = Form.Item
const phoneFliterRules = /(^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$)|(^((86)|(\\+86))?1[3-9][0-9]{9}$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4})(.)(\d{1,4})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4}$))/
const MessageList: FC = () => {

  return <>
    <Form.Item
      className={styles['product-key-container']}
      label={'表单详情:'}
      key={'formInfo'}
    >
      <div className={styles['setting-tip']}
      >请输入参数名和参数值，例如"城市"，"输入你所在的城市"，
        <Tooltip color='#fff' placement="right" overlayInnerStyle={{ cursor: 'pointer' }} title={<img src="//file.baixing.net/202109/18cfbd879b579812ea7d146a56e9bc37.png" alt="logo" style={{ width: 520, height: 242 }} />}>
          <QuestionCircleOutlined className={styles['tip-img']} />
        </Tooltip >
      </div>
      {
        ['name', 'tel'].map(item => {
          return (
            <div className={styles['product-key-line']} key={item}>
              <FormItem className={styles['form-item']} name={[item, 'key']} initialValue={item === 'name' ? '姓名' : '联系方式'} key={item + 'key'}>
                <Input maxLength={10} className={styles['formItem']} disabled size="large" />
              </FormItem>
              <FormItem className={styles['form-item']} name={[item, 'value']} key={item + 'value'} rules={[{ required: false, message: item === 'name' ? '请输入你的称呼' : '请输入你的姓名' }, { pattern: item === 'tel' ? phoneFliterRules : /^[\s\S]{2,20}$/, message: '2～20个字' }]}>
                <Input maxLength={20} className={styles['formItem']} placeholder={item == 'name' ? '输入你的称呼' : '输入你的电话'} size="large" />
              </FormItem>
              <FormItem className={styles['form-swith']} key={item + 'switch'} initialValue={true} valuePropName="checked" label="是否必填" name={[item, 'switch']}>
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
                <FormItem className={styles['form-item']} name={[name, 'key']} fieldKey={[fieldKey, 'key']} rules={[{ required: true, message: '请输入' }, { pattern: /^[\s\S]{2,10}$/, message: '2～10个字' }]}>
                  <Input maxLength={10} className={styles['formItem']} placeholder={'请输入'} size="large" />
                </FormItem>
                <FormItem className={styles['form-item']} name={[name, 'value']} fieldKey={[fieldKey, 'value']} rules={[{ required: true, message: '请输入' }, { pattern: /^[\s\S]{2,10}$/, message: '2～10个字' }]}>
                  <Input maxLength={10} className={styles['formItem']} placeholder={'请输入'} size="large" />
                </FormItem>
                <FormItem className={styles['form-swith']} valuePropName="checked" initialValue={true} label="是否必填" name={[name, 'switch']} fieldKey={[fieldKey, 'switch']}>
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