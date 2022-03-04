import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import WildcatForm from '@/components/wildcat-form';
import GroupModal from '../../../components/group-modal';
import { productForm } from './config';
import { Button, Drawer } from 'antd';
import { CateItem, RouteParams, ProductListItem, ShopInfo } from '@/interfaces/shop';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { createProductApi, updateProductApi } from '@/api/shop';
import { useParams } from 'umi';
import { ContentCateType } from '@/enums';
import MyModal from '@/components/modal';
import { isEmptyObject } from '@/utils';
import { errorMessage, successMessage } from '@/components/message';
import GroupSelectBtn from './components/group-select-btn'
import ProductKey from './components/product-key'
import './index.less'
import { getImgUploadModelValue, getImgUploadValueModel } from '@/components/img-upload';
import { MediaItem } from '@/components/img-upload/data';
import { CompanyInfo } from '@/interfaces/ai-module';
interface Props {
  isB2B: boolean,
  typeTxt: string
  cateList: CateItem[];
  editData: ProductListItem | { [key: string]: any }
  visible: boolean;
  onClose(): void;
  updateCateList(item: CateItem[]): void;
  updateEditData?: (params: ProductListItem) => void,
  curShopInfo?: ShopInfo | null
}

const ProductBox = (props: Props) => {
  const { isB2B, typeTxt, onClose, visible, editData, cateList, updateCateList, updateEditData, curShopInfo } = props;
  // 弹窗显示隐藏
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [quitModalVisible, setQuitModalVisible] = useState(false)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [formConfig, setformConfig] = useState<FormConfig>(productForm(typeTxt, isB2B))
  const params: RouteParams = useParams();
  const initEditData = useMemo(() => {
    let media = editData ? (editData.videoUrl ? getImgUploadValueModel('VIDEO', editData.videoUrl, editData.headImg) : getImgUploadValueModel('IMAGE', editData.headImg)) : undefined
    return {
      ...editData,
      media,
      contentImg: editData?.contentImg?.map((item: string) => getImgUploadValueModel('IMAGE', item)),
      seoKeyWord: Array.isArray(editData.seoKeyWord) ? editData.seoKeyWord : [editData.seoKeyWord]
    }
  }, [editData])


  // 弹窗错误显示
  const [placement, setPlacement] = useState<"right" | "top" | "bottom" | "left" | undefined>("right")

  const initForm = () => {
    const newFormConfig = productForm(typeTxt, isB2B, (params) => updateEditData && updateEditData(params) )
    // 初始化表单----> value
    const newArticleFormChildren = newFormConfig.children.map(item => {
      if (item.name === 'contentCateId') {
        return {
          ...item,
          options: cateList.map(x => { return { key: x.name, value: x.id } }),
          slotDom: <GroupSelectBtn item={item} onClick={onModalClick}></GroupSelectBtn>
        }
      }
      return item
    })
    newFormConfig.customerFormItemList = [{
      key: 'params',
      index: 6,
      node: <ProductKey key={'params'} isB2B={isB2B}></ProductKey>
    }]
    setformConfig({
      ...newFormConfig,
      children: newArticleFormChildren
    })
  }

  useEffect(() => {
    initForm()
  }, [cateList, isB2B])

  const sumbit = async (values: any) => {
   let contents = values.content
   if(contents === '<p><br></p>') {
     return errorMessage('请输入服务描述')
   }
    values.name = values.name.trim();
    const isEdit = Boolean((editData as ProductListItem)?.id)

    if (!values.price) { values.price = '面议' }
    if (values.seoKeyWord && values.seoKeyWord.length > 0) {
      values.seoKeyWord = values.seoKeyWord[0]
    } else {
      values.seoKeyWord = ''
    }
    const media = values.media
    if (media) {
      values.headImg = media.mediaType === 'IMAGE' ? getImgUploadModelValue(values.media) : getImgUploadModelValue(values.media, true)
      values.videoUrl = media.mediaType === 'VIDEO' ? getImgUploadModelValue(values.media) : undefined
    }
    values.contentImg = !values.contentImg || values.contentImg.length === 0 ? null : !Array.isArray(values.contentImg) ? getImgUploadModelValue(values.contentImg) : values.contentImg.map((item: MediaItem) => getImgUploadModelValue(item)).join(',')
    delete values.media
    let resData: any;
    setFormLoading(true)
    if (isEdit) {
      resData = await updateProductApi(Number(params.id), { id: (editData as ProductListItem).id, ...values })
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

  const fillContent = (name: string, callback:(newValue: string, name: string) => void) => {
    const templateList = [
        `<p>${curShopInfo?.name}是专业生产各类 ${editData.seoKeyWord}，是行内知名的${editData.seoKeyWord}公司、厂家，其生产的 ${editData.seoKeyWord}在行业内属于知名${editData.seoKeyWord}品牌，其他相关${editData.seoKeyWord}价格_图片_行情_参数_货源情况可联系厂家免费获取。</p>`,
        `<p>${curShopInfo?.name}是专业的${editData.seoKeyWord}机构、中心、公司,${editData.seoKeyWord}是其名下的核心产品,拥有行业内先进的生产工艺,${editData.seoKeyWord}属于物美价廉的产品,全国范围内好评如潮。可以在线联系联系人获取最新的${editData.seoKeyWord}价格_图片_行情_参数_货源</p>`
    ]
    const template = templateList[Math.round(Math.random())]
    callback(template, name)
  }

  return (
    <Drawer
      title={`新建${typeTxt}123`}
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
        className="product-form" >
        {
            (lable: string | ReactNode, name: string, callBack:(newValue: string, name: string) => void) => name === 'content' && <p className="recommended-box">不知道怎么写？试试 <Button shape="round" onClick={(()=>fillContent(name,callBack))}>{lable}推荐</Button></p>
        }    
      </WildcatForm>
      <GroupModal
        type={ContentCateType.PRODUCT}
        editItem={null}
        visible={modalVisible}
        cateList={cateList}
        updateCateList={updateCateList}
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

export default ProductBox