
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE } from '@/models/shop';
import { ShopInfo } from '@/interfaces/shop';
import { Modal, FormInstance } from 'antd';
import { createContentCateApi, updateContentCateApi } from '@/api/shop'
import { CateItem, RouteParams, CreateContentCateApiParams, CreateContentCateParams } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ContentCateType, ProductType } from '@/enums';
import WildcatForm from '@/components/wildcat-form';
import { errorMessage, successMessage } from '@/components/message';
import { contentGroupForm } from './config'
import styles from './index.less';


interface Props {
  cateList: CateItem[]
  updateCateList: (val: CateItem[]) => void
  editItem: CateItem | null;
  type: ContentCateType;
  visible: boolean;
  onClose(): void;
  curShopInfo: ShopInfo | null
}
const NewCate = (props: Props) => {
  const params: RouteParams = useParams();
  const { cateList, updateCateList, editItem, type, onClose, curShopInfo } = props;
  const [config] = useState(contentGroupForm(curShopInfo?.type === ProductType.B2B, type))
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const formRef = useRef<{ form: FormInstance | undefined }>({ form: undefined })

  const initEditData = useMemo(() => {
    if (editItem) {
      return {
        ...editItem,
        seoK: editItem.seoK ? editItem.seoK.split(',') : []
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

  const handleSubmit = async (values: CreateContentCateParams) => {
    const requestData: CreateContentCateApiParams = {
      id: editItem?.id,
      name: values.name,
      seoD: values.seoD || '',
      seoK: values.seoK ? values.seoK.join(',') : '',
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
    className={styles["g-modal"]}
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
export default connect((state: ConnectState) => {
  const { curShopInfo } = state[SHOP_NAMESPACE];
  return { curShopInfo }
}
)(NewCate)
