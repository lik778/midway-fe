import React, { FC, ReactElement } from 'react'
import { Form, Radio, } from 'antd'
interface Iprop {

}

const CheckoutGroup: FC<Iprop> = (): ReactElement => {
  return (
    <>
      <Form.Item name="radio-group" label="您的身份：" rules={[{ required: true, message: '请选择你的身份' }]}>
        <Radio.Group>
          <Radio value="SALES">百姓销售</Radio>
          <Radio value="CLIENT">商家</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  )
}

export default CheckoutGroup