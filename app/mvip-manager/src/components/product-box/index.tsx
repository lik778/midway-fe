import React, { useEffect, useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '@/components/group-modal';
import { productForm } from '@/config/form';
import { Drawer, Form } from 'antd';
import { CateItem, RouteParams } from '@/interfaces/shop';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { createProductApi, updateProductApi } from '@/api/shop';
import { useParams } from 'umi';
import { ContentCateType } from '@/enums';
import QuitFormModal from '@/components/quit-form-modal';
import { isEmptyObject } from '@/utils';
import { errorMessage, successMessage } from '@/components/message';

interface Props {
  cateList: CateItem[];
  editData?: any;
  visible: boolean;
  onClose(): void;
  updateCateList(item: CateItem): void;
}

export default (props: Props) => {
  const { onClose, visible, editData, cateList, updateCateList } = props;
  // 弹窗显示隐藏
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [quitModalVisible, setQuitModalVisible] = useState(false)
  const [formLoading, setFormLoading] = useState<boolean>(false)
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

  const sumbit = async (values: any) => {
    values.name = values.name.trim();
    const isEdit = !isEmptyObject(editData);
    if (!values.price) { values.price = '面议' }
    if (typeof values.tags === 'string') {
      values.tags = values.tags.split(',')
    }
    let resData: any;
    setFormLoading(true)
    if (isEdit) {
      resData = await updateProductApi(Number(params.id), { id: editData.id, ...values })
    } else {
      resData = await createProductApi(Number(params.id), values)
    }
    setFormLoading(false)
    if (resData.success) {
      successMessage(resData.message)
      setTimeout(() =>  location.reload(), 500)
    } else {
      errorMessage(resData.message)
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
          onClose={() => setQuitModalVisible(true)}
          visible={visible}
          key={placement}
          width="700"
        >
          <Form.Item>
           <WildcatForm
             editDataSource={editData}
             config={formConfig}
             submit={sumbit}
             onClick={onModalClick}
             loading={formLoading}
             className="default-form"/>
         </Form.Item>
         <GroupModal
           type={ContentCateType.PRODUCT}
           editItem={null}
           visible={modalVisible}
           groupUpdate={(item: CateItem) => { console.log(null) }}
           groupCreate={(item: CateItem) => updateCateList(item)}
           onClose={() => setModalVisible(false)} />
          <QuitFormModal
            visible={quitModalVisible} onOk={() => {
            setQuitModalVisible(false)
            onClose() }}
            onCancel={() => setQuitModalVisible(false)}/>
    </Drawer>
  );
}
