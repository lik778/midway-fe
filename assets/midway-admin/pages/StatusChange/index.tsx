import * as React from 'react';
import { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { statusChangeForm } from '../../interfaces/statusChange'
const StatusChange = () => {
  const [form] = Form.useForm<statusChangeForm>()
  const onFinish = (data: any) => {
    const value = form.getFieldsValue()
  }
  const onFinishFailed = (data: any) => {
  }
  return (
    <>
      <Form
        layout="vertical"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Form.Item
          label="店铺id"
          name="shopId"
          rules={[{ required: true, message: '请输入店铺id' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="操作原因"
          name="operationreason"
        >
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 0, span: 6 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
export default StatusChange