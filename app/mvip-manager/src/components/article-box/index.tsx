
import React, { useEffect, useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '@/components/group-modal';
import QuitFormModal from '@/components/quit-form-modal';
import { articleForm, productForm } from '@/config/form';
import { Form, Drawer, message } from 'antd';
import { CateItem, CreateArticleApiParams, RouteParams } from '@/interfaces/shop';
import { ContentCateType } from '@/enums';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { createArticleApi, updateArticleApi } from '@/api/shop';
import { useParams } from 'umi';
import { isEmptyObject } from '@/utils';

interface Props {
  cateList: CateItem[];
  editData?: any;
  visible: boolean;
  onClose(): void;
  updateCateList(item: CateItem): void;
  addArticleList(item: any): void;
  updateArticleList(item: any): void;
}
export default (props: Props) => {
  const { visible, editData, onClose, cateList, updateCateList, addArticleList, updateArticleList } = props
  // 弹窗显示隐藏
  const [modalVisible, setModalVisible] = useState(false)
  const [quitModalVisible, setQuitModalVisible] = useState(false)
  const [formConfig, setformConfig] = useState<FormConfig>(productForm)
  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")
  const params: RouteParams = useParams();

  useEffect(() => {
    // 初始化表单----> value
    const item: any = articleForm.children.find((x: FormItem) => x.name === 'contentCateId')
    item.options = cateList.map(x => { return { key: x.name, value: x.id } })
    setformConfig(articleForm)
  }, [cateList])

  const sumbit = async (values: any) => {
    let resData: any;
    const isEdit = !isEmptyObject(editData);
    if (typeof values.tags === 'string') {
      values.tags = values.tags.split(',')
    }
    if (isEdit) {
      resData = await updateArticleApi(Number(params.id), { id: editData.id, ...values })
    } else {
      resData = await createArticleApi(Number(params.id), values)
    }
    if (resData.success) {
      message.success(resData.message)
      if (isEdit) {
        updateArticleList(resData.data)
      } else {
        addArticleList(resData.data)
      }
      onClose()
    } else {
      message.error(resData.message)
    }
  }

  const onModalClick = (e: any) => {
    setModalVisible(true)
  }


  return (
    <Drawer
          title="新建文章"
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
              className="default-form"/>
         </Form.Item>
        <GroupModal
          type={ContentCateType.ARTICLE}
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
