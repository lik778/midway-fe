
import React , { useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import { articleForm } from '@/config/form';
import { Button, Form, Drawer } from 'antd';
export default (props: any) => {

  // 弹窗显示隐藏
  const [visible, setVisible] = useState(true)
  
  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")

  const sumbit = (values: any) => {
    console.log(values)
  }


  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };



  return (
    <Drawer
          title="新建文章"
          placement={placement}
          closable={true}
          onClose={onClose}
          visible={visible}
          key={placement}
          width="700"
        >
          <Form.Item>
           <WildcatForm config={articleForm} submit={sumbit} className="default-form"/>
         </Form.Item>
    </Drawer>
  );
}
