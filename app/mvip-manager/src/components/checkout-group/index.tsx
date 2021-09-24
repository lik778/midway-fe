import React, { FC, ReactElement } from 'react'
import { Form, Radio, } from 'antd'
interface Iprop {

}

const CheckoutGroup: FC<Iprop> = (): ReactElement => {
  return (
    <>
      <Form.Item name="identity" label="您的身份：" key="identity" rules={[{ required: true, message: '请选择你的身份' }]}>
        <Radio.Group key="identity">
          <Radio value="SALES" key="SALES">百姓销售</Radio>
          <Radio value="CLIENT" key="CLIENT">商家</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  )
}

export default CheckoutGroup