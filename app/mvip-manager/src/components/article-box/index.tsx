
import React, { useEffect, useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '@/components/group-modal';
import { articleForm, productForm } from '@/config/form';
import { Form, Drawer } from 'antd';
import { CateItem } from '@/interfaces/shop';
import { ContentCateType } from '@/enums';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';

interface Props {
  cateList: CateItem[];
  visible: boolean;
  onClose(): void;
  updateCateList(item: CateItem): void;
  addArticleList(item: any): void;
}
export default (props: Props) => {
  const { visible, onClose, cateList, updateCateList } = props
  // 弹窗显示隐藏
  const [modalVisible, setModalVisible] = useState(false)
  const [formConfig, setformConfig] = useState<FormConfig>(productForm)
  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")

  useEffect(() => {
    // 初始化表单----> value
    const item: any = articleForm.children.find((x: FormItem) => x.name === 'contentCateId')
    item.options = cateList.map(x => { return { key: x.name, value: x.id } })
    setformConfig(articleForm)
  }, [cateList])

  const sumbit = (values: any) => {
    console.log(values)
  }

  const onModalClick = (e: any) => {
    setModalVisible(true)
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
        <GroupModal
          type={ContentCateType.ARTICLE}
          editItem={null}
          visible={modalVisible}
          groupUpdate={(item: CateItem) => { console.log(null) }}
          groupCreate={(item: CateItem) => updateCateList(item)}
          onClose={() => setModalVisible(false)} />
    </Drawer>
  );
}
