
import React, { useEffect, useState, useMemo, useRef } from 'react';
import './index.less';
import { Modal, FormInstance } from 'antd';
import { createContentCateApi, updateContentCateApi } from '@/api/shop'
import { CateItem, RouteParams, CreateContentCateApiParams, } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ContentCateType } from '@/enums';
import WildcatForm from '@/components/wildcat-form';
import { errorMessage, successMessage } from '@/components/message';
import { contentGroupForm } from './config'


interface Props {
  cateList: CateItem[]
  updateCateList: (val: CateItem[]) => void
  editItem: CateItem | null;
  type: ContentCateType;
  visible: boolean;
  onClose(): void;
}
const NewCate = (props: Props) => {
  const params: RouteParams = useParams();
  const { cateList, updateCateList, editItem, type, onClose } = props;
  const [config] = useState(contentGroupForm)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const formRef = useRef<{ form: FormInstance | undefined }>({ form: undefined })

  const initEditData = useMemo(() => {
    if (editItem) {
      return {
        ...editItem,
      }
    } else {
      return { rank: 1 }
    }
  }, [editItem])

  const delItem = (list: CateItem[], val: CateItem) => {
    const oldIndex = list.findIndex((item: CateItem) => item.id === val.id)
    list.splice(oldIndex, 1)
    return list
  }

  const addItem = (list: CateItem[], val: CateItem) => {
    const newIndex = list.findIndex((item: CateItem) => !item.weight || item.weight < val.weight
    )
    list.splice(newIndex === -1 ? list.length : newIndex, 0, val)
    return list
  }

  const groupCreate = (val: CateItem) => {
    let newCateList = [...cateList]
    newCateList = addItem(newCateList, val)
    updateCateList(newCateList)
  }

  const groupUpdate = (val: CateItem) => {
    let newCateList = [...cateList]
    newCateList = delItem(newCateList, val)
    newCateList = addItem(newCateList, val)
    updateCateList(newCateList)
  }

  const handleSubmit = async (values: CreateContentCateApiParams) => {
    const requestData: CreateContentCateApiParams = {
      id: editItem?.id,
      name: values.name,
      seoD: values.seoD || '',
      seoK: values.seoK || '',
      seoT: values.seoT || '',
      weight: values.weight,
      type,
    }
    setUpDataLoading(true)

    const res = await (editItem ? updateContentCateApi : createContentCateApi)(Number(params.id), requestData)
    console.log(res)
    if (res.success) {
      if (editItem) {
        successMessage('修改成功')
        groupUpdate(res.data);
      } else {
        groupCreate(res.data);
        successMessage('新建成功')
      }
      handleClose()
    } else {
      errorMessage(res.message)
    }
    setUpDataLoading(false)
  }

  const handleClose = () => {
    formRef.current.form?.resetFields()
    onClose();
  }

  return <Modal
    width={580}
    title={`${editItem ? '编辑' : '新建'}分组`}
    visible={props.visible}
    confirmLoading={upDataLoading}
    onCancel={handleClose}
    className="g-modal"
    footer={null}
  >
    <WildcatForm
      ref={formRef}
      editDataSource={initEditData}
      config={config}
      submit={handleSubmit}
      loading={upDataLoading}
    />
  </Modal>
}

//取状态管理里的当前店铺信息，用于判断店铺类型，是否显示SEO设置
export default NewCate
