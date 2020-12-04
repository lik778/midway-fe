
import React, { useEffect, useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '@/components/group-modal';
import { productForm } from '@/config/form';
import { Form, Drawer, message } from 'antd';
import { CateItem, CreateProductApiParams, RouteParams } from '@/interfaces/shop';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { createProductApi, updateContentCateApi } from '@/api/shop';
import { useParams } from 'umi';

interface Props {
  cateList: CateItem[];
  visible: boolean;
  onClose(): void;
  addProductList(item: any): void;
}

export default (props: Props) => {
  const { onClose, visible, cateList, addProductList } = props;
  // 弹窗显示隐藏
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [formConfig, setformConfig] = useState<FormConfig>(productForm)
  const params: RouteParams = useParams();

  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")

  useEffect(() => {
    // 初始化表单----> value
    const item: any = formConfig.children.find((x: FormItem) => x.name === 'contentCateId')
    item.options = cateList.map(x => { return { key: x.name, value: x.id } })
    setformConfig(formConfig)
  }, [cateList])

  const sumbit = async (values: CreateProductApiParams) => {
    if (!values.price) { values.price = '面议' }
    values.tags = '专业,牛逼'
    values.shopId = Number(params.id)
    const res = await createProductApi(values.shopId, values)
    if (res.success) {
      message.success(res.message)
      addProductList(res.data)
      onClose()
    } else {
      message.error(res.message)
    }
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
