
import React , { useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '@/components/group-modal';
import { articleForm } from '@/config/form';
import { Form, Drawer } from 'antd';
import { CateItem } from '@/interfaces/shop';

interface Props {
  cateList: CateItem[];
  visible: boolean;
  onClose(): void;
  addArticleList(item: any): void;
}
export default (props: Props) => {
  const { visible, onClose, cateList } = props
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
          title="新建文章"
          placement={placement}
          closable={true}
          onClose={onClose}
          visible={visible}
          key={placement}
          width="700"
        >
          <Form.Item>
           <WildcatForm config={articleForm} submit={sumbit} onClick={onModalClick} className="default-form"/>
         </Form.Item>
         {/*<GroupModal visible={modalVisible} onClose={() => setModalVisible(false)}></GroupModal>*/}
    </Drawer>
  );
}
