
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
  quota?: any;
  onClose(): void;
  updateCateList(item: CateItem): void;
  addArticleList(item: any): void;
  updateArticleList(item: any): void;
  updateQuota(quota:any):void;
}
export default (props: Props) => {
  const { quota, visible, editData, onClose, cateList, updateCateList, addArticleList, updateArticleList, updateQuota} = props
  // 弹窗显示隐藏
  const [modalVisible, setModalVisible] = useState(false)
  const [quitModalVisible, setQuitModalVisible] = useState(false)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [formConfig, setformConfig] = useState<FormConfig>(productForm)
  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")
  const params: RouteParams = useParams();
  const [modal, contextHolder] = Modal.useModal();
  let formValues:any = null;
  const rechargeTxt = (url: string) => {return `您的免费发文额度已用完，信息发布点不足。<a href=${url} target='_blank'><i style='color:rgb(255, 134, 0)'>去充值&gt;</i></a>`}
  const consumeTxt = `您剩余1个免费发文额度，免费额度用完继续发文会消耗套餐内的信息发布点`

  const consumeText = () => {
    if(quota?.freeNum === 0 && quota?.postRemain<6) {
        return rechargeTxt(quota?.buyUrl) 
    }else if(quota?.freeNum === 1){
       return consumeTxt
    }

    return ''
  }
  const config = {
    title: '温馨提示',
    closable:true,
    onOk: async()=>{
      if(quota?.freeNum === 1) {
        const resData = await createArticleApi(Number(params.id), formValues)
        if (resData?.success) {
          message.success('发布成功')
          addArticleList(resData.data)
          let newQuota = quota
          newQuota['freeNum'] = newQuota['freeNum'] - 1
          updateQuota(newQuota)
          onClose()
        } else {
          message.error(resData.message)
        }
      }
    },
    onCancel: ()=>{
    },
    content: (
     <div className="quota-text" dangerouslySetInnerHTML={{__html: consumeText()}} >
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
    values.name = values.name.trim()
    let resData: any;
    const isEdit = !isEmptyObject(editData);
    if (typeof values.tags === 'string') {
      values.tags = values.tags.split(',')
    }
    formValues = values

    setFormLoading(true)
    if (isEdit) {
      resData = await updateArticleApi(Number(params.id), { id: editData.id, ...values })
    } else {
      if(quota?.freeNum === 1 || (quota?.freeNum === 0 && quota.postRemain < 6)){
        setFormLoading(false)
        modal.confirm(config);
        return
      }
      resData = await createArticleApi(Number(params.id), values)
    }
    setFormLoading(false)
    if (resData?.success) {
      message.success('发布成功')
      if (isEdit) {
        updateArticleList(resData.data)
      } else {
        addArticleList(resData.data)
        let newQuota = quota
        if(quota?.freeNum >1){
          newQuota['freeNum'] = newQuota['freeNum'] - 1
        }else if(quota?.postRemain > 6) {
          newQuota['postRemain'] = newQuota['postRemain'] - 6
        }
        updateQuota(newQuota)
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
