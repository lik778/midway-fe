import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Button, InputNumber, Form, message, Select } from 'antd';
import { statusChangeForm } from '../../interfaces/statusChange'
import { statusChange } from '../../api/statusChange'
const StatusChange = () => {
  const [form] = Form.useForm<statusChangeForm>()
  const onFinish = async () => {
    const value = form.getFieldsValue()
    const res = await statusChange({ id: Number(value.id), status: value.status })
    if (res.success) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
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
          name="id"
          rules={[{ required: true, message: '请输入店铺id' }]}
          wrapperCol={{ span: 8 }}
        >
          <InputNumber style={{ width: 300 }} placeholder="请输入店铺id" />
        </Form.Item>
        <Form.Item
          label="选择状态"
          name="status"
          wrapperCol={{ span: 4 }}
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Select.Option value="ONLINE">
              上线
            </Select.Option>
            <Select.Option value="OFFLINE_SENSITIVE">
              审核驳回下线
            </Select.Option>
          </Select>
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