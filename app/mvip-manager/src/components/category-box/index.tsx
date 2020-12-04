
import React, { useEffect, useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '@/components/group-modal';
import { productForm } from '@/config/form';
import { Form, Drawer } from 'antd';
import { CateItem } from '@/interfaces/shop';
import { FormItem } from '@/components/wildcat-form/interfaces';
interface Props {
  cateList: CateItem[];
  visible: boolean;
  onClose(): void;
}

export default (props: Props) => {
  const { onClose, visible, cateList } = props;
  // 弹窗显示隐藏
  const [modalVisible, setModalVisible] = useState(false)
  const [formConfig, setformConfig] = useState(productForm)

  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")

  useEffect(() => {
    // 初始化表单----> value
    const item: any = formConfig.children.find((x: FormItem) => x.name === 'contentCateId')
    item.options = cateList.map(x => { return { key: x.name, value: x.id } })
    setformConfig(formConfig)
  }, [cateList])

  const sumbit = (values: any) => {
    console.log(values)
  }

  const onModalClick = (e: any) => {
    setModalVisible(true)
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
           <WildcatForm config={formConfig} submit={sumbit} onClick={onModalClick} className="default-form"/>
         </Form.Item>
         {/*<GroupModal visible={modalVisible} onClose={onModalClose}></GroupModal>*/}
    </Drawer>
  );
}
