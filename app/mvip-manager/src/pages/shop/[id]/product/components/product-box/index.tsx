import React, { useEffect, useMemo, useState } from 'react';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '../../../components/group-modal';
import { productForm } from './config';
import { Drawer, Form } from 'antd';
import { CateItem, RouteParams } from '@/interfaces/shop';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { createProductApi, updateProductApi } from '@/api/shop';
import { useParams } from 'umi';
import { ContentCateType } from '@/enums';
import MyModal from '@/components/modal';
import { isEmptyObject } from '@/utils';
import { errorMessage, successMessage } from '@/components/message';
import GroupSelectBtn from './components/group-select-btn'
import './index.less'
import { getImgUploadModelValue, getImgUploadValueModel } from '@/components/img-upload';
import { MediaItem } from '@/components/img-upload/data';
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
  const initEditData = useMemo(() => {
    return {
      ...editData,
      headImg: getImgUploadValueModel('IMAGE', editData?.headImg),
      contentImg: editData?.contentImg?.map((item: string) => getImgUploadValueModel('IMAGE', item))
    }
  }, [editData])


  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")


  const initForm = () => {
    // 初始化表单----> value
    const newArticleFormChildren = productForm.children.map(item => {
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
      ...productForm,
      children: newArticleFormChildren
    })
  }

  useEffect(() => {
    initForm()
  }, [cateList])

  const sumbit = async (values: any) => {
    values.name = values.name.trim();
    const isEdit = !isEmptyObject(editData);
    values.headImg = getImgUploadModelValue(values.headImg)
    values.contentImg = values.contentImg.map((item: MediaItem) => getImgUploadModelValue(item))
    if (!values.price) { values.price = '面议' }
    if (typeof values.tags === 'string') {
      values.tags = values.tags.split(',')
    }
    values.contentImg = !values.contentImg || values.contentImg.length === 0 ? null : typeof values.contentImg === 'string' ? values.contentImg : values.contentImg.join(',')
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
      title="新建服务"
      placement={placement}
      closable={true}
      onClose={() => setQuitModalVisible(true)}
      visible={visible}
      key={placement}
      width="700"
      destroyOnClose={true}
    >
      <WildcatForm
        editDataSource={initEditData}
        config={formConfig}
        submit={sumbit}
        onClick={onModalClick}
        loading={formLoading}
        className="product-form" />
      <GroupModal
        type={ContentCateType.PRODUCT}
        editItem={null}
        visible={modalVisible}
        groupUpdate={(item: CateItem) => { console.log(null) }}
        groupCreate={(item: CateItem) => updateCateList(item)}
        onClose={() => setModalVisible(false)} />
      <MyModal
        title="确认关闭"
        content="您还没有提交，退出后当前页面的内容不会保存，确认退出？"
        visible={quitModalVisible} onOk={() => {
          setQuitModalVisible(false)
          onClose()
        }}
        onCancel={() => setQuitModalVisible(false)} />
    </Drawer>
  );
}
