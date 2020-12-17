
import React, { useEffect, useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '@/components/group-modal';
import QuitFormModal from '@/components/quit-form-modal';
import { articleForm, productForm } from '@/config/form';
import { Form, Drawer, message, Modal } from 'antd';
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
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [formConfig, setformConfig] = useState<FormConfig>(productForm)
  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")
  const params: RouteParams = useParams();
  const [modal, contextHolder] = Modal.useModal();
  const rechargeTxt = `您的免费发文额度已用完，信息发布点不足。<i style='color:rgb(255, 134, 0)'>去充值&gt;</i>`
  const consumeTxt = `您的免费发文额度已用完，继续发文会消耗套餐内的信息发布点`
  const config = {
    title: '温馨提示',
    closable:true,
    onOk:()=>{
      console.log(111)
    },
    onCancel: ()=>{
      console.log(222)
    },
    content: (
     <div className="quota-text" dangerouslySetInnerHTML={{__html: rechargeTxt}} >
     </div>
    ),
  };

  useEffect(() => {
    // 初始化表单----> value
    const item: any = articleForm.children.find((x: FormItem) => x.name === 'contentCateId')
    item.options = cateList.map(x => { return { key: x.name, value: x.id } })
    setformConfig(articleForm)
  }, [cateList])

  const sumbit = async (values: any) => {
    // modal.confirm(config);
    values.name = values.name.trim()
    let resData: any;
    const isEdit = !isEmptyObject(editData);
    if (typeof values.tags === 'string') {
      values.tags = values.tags.split(',')
    }
    setFormLoading(true)
    if (isEdit) {
      resData = await updateArticleApi(Number(params.id), { id: editData.id, ...values })
    } else {
      resData = await createArticleApi(Number(params.id), values)
    }
    setFormLoading(false)
    if (resData?.success) {
      message.success('发布成功')
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
              loading={formLoading}
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
        {contextHolder}
    </Drawer>
  );
}
