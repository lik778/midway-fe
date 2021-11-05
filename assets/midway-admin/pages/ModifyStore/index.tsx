import * as React from 'react';
import { useState } from 'react';
import { Button, Input, Form, message, InputNumber } from 'antd';
import { Getshopmodifystore } from '../../interfaces/commonFunction'
import { setStoreNameApi } from '../../api/commonFunction'

const ModifyStore = () => {
  const [form] = Form.useForm<Getshopmodifystore>();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const upload = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    setUploadLoading(true)
    const res = await setStoreNameApi(values)
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
        label="店铺id"
        name="id"
        rules={[{ required: true, message: '请输入店铺id' }]}
      >
        <InputNumber style={{ width: 300 }} placeholder="请输入店铺id" />
      </Form.Item>
      <Form.Item
        label="店铺名称"
        name="domain"
        rules={[{ required: true, message: '请输入店铺名称' }]}
      >
        <Input style={{ width: 300 }} placeholder="请输入店铺名称" />
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

export default ModifyStore