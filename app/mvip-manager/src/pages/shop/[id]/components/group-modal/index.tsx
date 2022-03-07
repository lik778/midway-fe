
import React, { useState, useMemo, useRef, ReactNode } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE } from '@/models/shop';
import { ShopInfo } from '@/interfaces/shop';
import { Modal, FormInstance, Button } from 'antd';
import { createContentCateApi, getseoAutoFillApi, updateContentCateApi } from '@/api/shop'
import { CateItem, RouteParams, CreateContentCateApiParams, CreateContentCateParams } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ContentCateType, ProductType } from '@/enums';
import WildcatForm from '@/components/wildcat-form';
import { errorMessage, successMessage } from '@/components/message';
import { contentGroupForm } from './config'
import styles from './index.less';
import { TdkDetail } from '../../../../../interfaces/shop';


interface Props {
  cateList: CateItem[]
  updateCateList: (val: CateItem[]) => void
  editItem: CateItem | null;
  type: ContentCateType;
  visible: boolean;
  onClose(): void;
  curShopInfo: ShopInfo | null,
  updateEditItem?: (params: any) => void
}
const RECOMMEND_TYPES = ['seoT']
const NewCate = (props: Props) => {
  const params: RouteParams = useParams();
  const { cateList, updateCateList, editItem, type, onClose, curShopInfo, updateEditItem = () => {} } = props;
  const [config] = useState(contentGroupForm(curShopInfo?.type === ProductType.B2B, type, (params) => updateEditItem(params)))
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [template, setTemplate] = useState<TdkDetail>()
  const formRef = useRef<{ form: FormInstance | undefined }>({ form: undefined })

  const initEditData = useMemo(() => {
    if (editItem) {
      const seoK = editItem.seoK ? ( Array.isArray(editItem.seoK) ? editItem.seoK : editItem.seoK.split(',') ) : []
      return {
        ...editItem,
        seoK
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
      seoT: (values.seoT || '').replace(/｜/g, '|'),
      weight: values.weight,
      type,
    }
    setUpDataLoading(true)

    const res = await (editItem ? updateContentCateApi : createContentCateApi)(Number(params.id), requestData)
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

  const fillContent = async (name: string, cb: (params: string, name: string) => void) => {
    if(template && template.title){
        cb(template?.title, name)
    } else {
        const { data } = await getseoAutoFillApi(Number(curShopInfo?.id), { position: "productCatePage" })
        setTemplate(data)
        cb(data?.title || '', name)
    }
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
    >
        {
            (lable: string | ReactNode, name: string, callBack:(newValue: string, name: string) => void) => curShopInfo?.type === ProductType.B2B && RECOMMEND_TYPES.includes(name) && <p className={styles["group-recommended-box"]}>为您推荐：<Button shape="round" onClick={(()=>fillContent(name,callBack))}>{lable}推荐</Button></p>
        } 
    </WildcatForm>
  </Modal>
}

//取状态管理里的当前店铺信息，用于判断店铺类型，是否显示SEO设置
export default connect((state: ConnectState) => {
  const { curShopInfo } = state[SHOP_NAMESPACE];
  return { curShopInfo }
}
)(NewCate)
