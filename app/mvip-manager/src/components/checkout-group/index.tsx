import React, { FC, ReactElement } from 'react'
import { Form, Radio, } from 'antd'
interface Iprop {

}

const CheckoutGroup: FC<Iprop> = (): ReactElement => {
  return (
    <>
      <Form.Item name="radio-group" label="Radio.Group">
        <Radio.Group>
          <Radio value="a">item 1</Radio>
          <Radio value="b">item 2</Radio>
          <Radio value="c">item 3</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  )
}

export default CheckoutGroup