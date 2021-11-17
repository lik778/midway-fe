import React, { useEffect, useState, useMemo } from 'react';
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
import { getImgUploadModelValue, getImgUploadValueModel } from '@/components/img-upload';
import { errorMessage, successMessage } from '@/components/message';
import GroupSelectBtn from './components/group-select-btn'

interface Props {
  cateList: CateItem[];
  editData?: any;
  visible: boolean;
  quota?: any;
  onClose(): void;
  updateCateList(item: CateItem[]): void;
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

  const initEditData = useMemo(() => {
    return {
      ...editData,
      contentImg: editData?.contentImg ? getImgUploadValueModel('IMAGE', editData.contentImg) : undefined
    }
  }, [editData])

  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")
  const params: RouteParams = useParams();
  const [modal, contextHolder] = Modal.useModal();
  let formValues: any = null;
  const rechargeTxt = (url: string) => {
    if (url) {
      return <>您的免费发文额度已用完，信息发布点不足。<a href={url} target='_blank' style={{ color: 'rgb(255, 134, 0)' }}>去充值&gt;</a></>
    } else {
      return <>您的免费发文额度已用完。</>
    }
  }

  const consumeTxt = <>您剩余1个免费发文额度，免费额度用完继续发文会消耗套餐内的信息发布点</>

  const consumeText = () => {
    return <div className="quota-text">
      {
        quota?.freeNum === 0 && quota?.postRemain < 6 && rechargeTxt(quota?.buyUrl)
      }
      {
        quota?.freeNum === 1 && consumeTxt
      }
    </div>
  }

  useEffect(() => {
    // 初始化表单----> value
    const newArticleFormChildren = articleForm.children.map(item => {
      if (item.name === 'contentCateId') {
        return {
          ...item,
          options: cateList.map(x => { return { key: x.name, value: x.id } }),
          slotDom: <GroupSelectBtn item={item} onClick={onModalClick}></GroupSelectBtn>
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
    formValues = values
    values.contentImg = getImgUploadModelValue(values.contentImg)
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
      destroyOnClose={true}
    >
      <Form.Item>
        <WildcatForm
          editDataSource={initEditData}
          config={formConfig}
          submit={sumbit}
          loading={formLoading}
          className="article-form" />
      </Form.Item>
      <GroupModal
        type={ContentCateType.ARTICLE}
        editItem={null}
        visible={modalVisible}
        cateList={cateList}
        updateCateList={updateCateList}
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
        content={consumeText()}
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
