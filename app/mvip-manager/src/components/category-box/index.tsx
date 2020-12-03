
import React , { useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '@/components/group-modal';
import { categoryForm } from '@/config/form';
import { Form, Drawer } from 'antd';
export default (props: any) => {
  const { onClose, visible } = props;
  // 弹窗显示隐藏
  const [modalVisible, setModalVisible] = useState(false)

  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")

  const sumbit = (values: any) => {
    console.log(values)
  }


  const onModalClick = (e: any) => {
    setModalVisible(true)
  }

  const onModalClose = (status: boolean) => {
    setModalVisible(status)
  }


  return (
    <Drawer
          title="新建服务"
          placement={placement}
          closable={true}
          onClose={onClose}
          visible={visible}
          key={placement}
          width="700"
        >
          <Form.Item>
           <WildcatForm config={categoryForm} submit={sumbit} onClick={onModalClick} className="default-form"/>
         </Form.Item>
         <GroupModal isModalVisible={modalVisible} onClose={onModalClose}></GroupModal>
    </Drawer>
  );
}
