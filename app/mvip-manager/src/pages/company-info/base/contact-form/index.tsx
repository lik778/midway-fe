import React from 'react'
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import WildcatForm from '@/components/wildcat-form';
import { contactForm } from '@/config/form';
import { QQCustomService } from '@/pages/company-info/base/qq-custom-service';

// const styles = {
//   addVendor: { width: 120, fontSize: 14, color: '#096DD9' }
// }
interface Props {
  back(): void;
}

const ContactForm = (props: Props) => {
  const sumbit = (values: any) => {
    console.log(values)
  }
  return (
    <div>
      <Form.Item label="电话/微信">
        <WildcatForm config={contactForm} submit={sumbit}/>
      </Form.Item>
      {/*<Form.Item className={styles.item} style={{ margin: '33px 0' }}>*/}
      {/*  <label className={styles.label}>第三方客服</label>*/}
      {/*  <Button className={styles.addVendor} type="dashed" size="large" icon={<PlusOutlined />} block>添加代码</Button>*/}
      {/*</Form.Item>*/}
      <Form.Item label="QQ客服">
        <QQCustomService />
      </Form.Item>
      <Button type="primary" size="large">保存</Button>
      <Button onClick={props.back} style={{ margin: '0 8px' }} size="large">上一步</Button>
    </div>
  )
}

export default ContactForm
