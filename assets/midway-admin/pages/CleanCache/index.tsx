import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Input, Form, message, InputNumber } from 'antd';
import { Getshopmodifystore } from '../../interfaces/commonFunction'
import { setStoreCleanCatchApi } from '../../api/commonFunction'

const StoreWhiteList = () => {
  const [form] = Form.useForm<Getshopmodifystore>();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const upload = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    const id = Number(values.userId)
    setUploadLoading(true)
    const res = await setStoreCleanCatchApi({ id })
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
        <InputNumber placeholder="请输入用户id" style={{ width: 300 }} />
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