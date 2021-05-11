import React, { useEffect, useState } from 'react';
import './index.less';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '../../../components/group-modal';
import MyModal, { ModalType } from '@/components/modal';
import { articleForm } from './config';
import { Drawer, Form, Modal } from 'antd';
import { CateItem, RouteParams } from '@/interfaces/shop';
import { ContentCateType } from '@/enums';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { createArticleApi, updateArticleApi } from '@/api/shop';
import { useParams } from 'umi';
import { isEmptyObject } from '@/utils';
import { errorMessage, successMessage } from '@/components/message';
import GroupSelectBtn from './components/group-select-btn'

interface Props {
  cateList: CateItem[];
  editData?: any;
  visible: boolean;
  quota?: any;
  onClose(): void;
  updateCateList(item: CateItem): void;
}
export default (props: Props) => {
  const { quota, visible, editData, cateList, updateCateList, onClose } = props
  // 弹窗显示隐藏
  const [modalVisible, setModalVisible] = useState(false)
  const [quitModalVisible, setQuitModalVisible] = useState(false)
  const [quotaModalVisible, setQuotaModalVisible] = useState(false)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>({})
  const [modalLoading, setModalLoading] = useState<boolean>(false)
  const [formConfig, setformConfig] = useState<FormConfig>(articleForm)
  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")
  const params: RouteParams = useParams();
  const [modal, contextHolder] = Modal.useModal();
  let formValues: any = null;
  const rechargeTxt = (url: string) => { return `您的免费发文额度已用完，信息发布点不足。<a href=${url} target='_blank'><i style='color:rgb(255, 134, 0)'>去充值&gt;</i></a>` }
  const consumeTxt = `您剩余1个免费发文额度，免费额度用完继续发文会消耗套餐内的信息发布点`

  const consumeText = () => {
    if (quota?.freeNum === 0 && quota?.postRemain < 6) {
      return rechargeTxt(quota?.buyUrl)
    } else if (quota?.freeNum === 1) {
      return consumeTxt
    }

    return ''
  }

  useEffect(() => {
    // 初始化表单----> value
    const newArticleFormChildren = articleForm.children.map(item => {
      if (item.name === 'contentCateId') {
        return {
          ...item,
          options: cateList.map(x => { return { key: x.name, value: x.id } }),
          btnConfig: <GroupSelectBtn item={item} onClick={onModalClick}></GroupSelectBtn>
        }
      }
      return item
    })

    setformConfig({
      ...articleForm,
      children: newArticleFormChildren
    })
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
      if (quota?.freeNum === 1 || (quota?.freeNum === 0 && quota.postRemain < 6)) {
        setFormLoading(false)
        setQuotaModalVisible(true);
        setFormData(formValues);
        return
      }
      resData = await createArticleApi(Number(params.id), values)
    }
    setFormLoading(false)
    if (resData?.success) {
      successMessage('发布成功')
      setTimeout(() => location.reload(), 500)
    } else {
      errorMessage(resData.message)
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
          loading={formLoading}
          className="article-form" />
      </Form.Item>
      <GroupModal
        type={ContentCateType.ARTICLE}
        editItem={null}
        visible={modalVisible}
        groupUpdate={(item: CateItem) => { console.log(null) }}
        groupCreate={(item: CateItem) => updateCateList(item)}
        onClose={() => setModalVisible(false)} />
      <MyModal
        title="确认关闭"
        content="您还没有提交，退出后当前页面的内容不会保存，确认退出？"
        visible={quitModalVisible}
        onOk={() => {
          setQuitModalVisible(false)
          onClose()
        }}
        onCancel={() => setQuitModalVisible(false)} />
      <MyModal
        title="温馨提示"
        content={<div className="quota-text" dangerouslySetInnerHTML={{ __html: consumeText() }} >
        </div>}
        type={ModalType.warning}
        visible={quotaModalVisible}
        confirmLoading={modalLoading}
        onOk={async () => {
          if (quota?.freeNum === 1) {
            setModalLoading(true)
            const resData = await createArticleApi(Number(params.id), formData)
            setModalLoading(false)
            if (resData?.success) {
              setTimeout(() => location.reload(), 500)
            } else {
              errorMessage(resData.message)
            }
          } else {
            setQuotaModalVisible(false)
          }
        }}
        onCancel={() => setQuotaModalVisible(false)} />
      {contextHolder}
    </Drawer>
  );
}
