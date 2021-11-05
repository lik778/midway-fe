import * as React from 'react';
import { useState } from 'react';
import { Button, InputNumber, Form, message } from 'antd';
import { Getshopmodifystore } from '../../interfaces/commonFunction'
import { setStoreWhitelistApi } from '../../api/commonFunction'

const StoreWhiteList = () => {
  const [form] = Form.useForm<Getshopmodifystore>();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)

  const upload = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    const id = Number(values.userId)
    setUploadLoading(true)
    const res = await setStoreWhitelistApi({ id })
    if (res.success) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
    setUploadLoading(false)
  }

  return (
    <Form layout="vertical" form={form} onFinish={upload}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 8 }}
    >
      <Form.Item
        label="用户id"
        name="userId"
        rules={[{ required: true, message: '请输入用户id' }]}
      >
        <InputNumber style={{ width: 300 }} placeholder="请输入用户id" />
      </Form.Item>
      <Form.Item >
        <Button
          type="primary"
          htmlType="submit"
          loading={uploadLoading}
          disabled={uploadLoading}
        >提交</Button>
      </Form.Item>
    </Form>
  )
}

export default StoreWhiteList