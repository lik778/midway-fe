import React, { FC, useState, useRef, useEffect } from 'react'
import { useParams } from 'umi'
import { Spin, FormInstance, Button } from 'antd';
import { ModuleID } from '../../data'
import { CustomerSetBigImage, CustomerSetBigImageDetail } from '@/interfaces/shop';
import { getImgUploadModelValue, getImgUploadValueModel } from '@/components/img-upload';
import { getCustomerSetApi, setCustomerBigImageSetApi } from '@/api/shop'
import { useDebounce } from '@/hooks/debounce';
import { errorMessage, successMessage } from '@/components/message';
import BaseForm from '../components/base-form'
import { FormType } from '@/components/wildcat-form/enums'
import { FormItem } from '@/components/wildcat-form/interfaces'
import styles from './index.less'
import pageStyles from '../../index.less'
import { MediaItem } from '@/components/img-upload/data';

interface Props {
  moduleID: ModuleID,
}

const BigImage: FC<Props> = (props) => {
  const { id: shopId } = useParams<{ id: string }>()
  const { moduleID } = props
  const [detail, setDatail] = useState<CustomerSetBigImage>({
    dataId: null,
    mainModuleId: Number(moduleID),
    show: false,
    pcImgList: [],
    type: 'THIRD',
    wapImgList: []
  })
  const [getDataLoading, setGetDataLoading] = useState(false)
  const [upDateLoading, setUpDateLoading] = useState(false)
  const baseForm = useRef<{
    formFn: () => FormInstance | null
  }>({ formFn: () => null })
  const [formItems] = useState<FormItem[]>([{
    className: pageStyles['form-item'], label: '上传电脑端图片', name: 'pcImgListGroup', maxLength: 10, type: FormType.ImgUpload, images: [{ uploadType: 2, text: ' ', name: 'pcImgList', maxSize: 3, aspectRatio: 1920 / 750, cropProps: { aspectRatio: 1920 / 750, notSelectCrop: true, autoAspectRatio: true }, showUploadList: { showSortIcon: true } }],
    required: false, tip: '图片格式：jpg、jpeg、png，大小不超过3M，建议尺寸为1920px*750px'
  },
  {
    className: pageStyles['form-item'], label: '上传移动端图片', name: 'wapImgListGroup', maxLength: 10, type: FormType.ImgUpload, images: [{ uploadType: 2, text: ' ', name: 'wapImgList', aspectRatio: 750 / 750, maxSize: 3, cropProps: { aspectRatio: 750 / 750, notSelectCrop: true, autoAspectRatio: true }, showUploadList: { showSortIcon: true } }],
    required: false, tip: '图片格式：jpg、jpeg、png，大小不超过3M，建议尺寸为750px*750px'
  }])


  const initModuleData = (data: CustomerSetBigImage) => {
    const { pcImgList = [], wapImgList = [], show } = data
    baseForm.current.formFn()?.setFieldsValue({
      show: typeof show === 'boolean' ? show : false,
      pcImgList: pcImgList.map(item => getImgUploadValueModel('IMAGE', item)),
      wapImgList: wapImgList.map(item => getImgUploadValueModel('IMAGE', item)),
    })
    console.log(baseForm.current.formFn()?.getFieldsValue())
  }

  // 初始化表单
  const getModuleData = async () => {
    setGetDataLoading(true)
    const res = await getCustomerSetApi(Number(shopId), moduleID)
    if (res.success) {
      if (res.data) {
        const { show, type, id, dataId, data } = res.data as CustomerSetBigImageDetail
        const newDetail: CustomerSetBigImage = {
          dataId,
          mainModuleId: Number(moduleID),
          show,
          type,
          pcImgList: data?.pcImgList || [],
          wapImgList: data?.wapImgList || []
        }
        setDatail(newDetail)
        initModuleData(newDetail)
      } else {
        // 如果没有请求到则给默认值
        initModuleData(detail)
      }
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    getModuleData()
  }, [])

  // 表单及子表单统一校验
  const validateForm = async () => await baseForm.current.formFn()?.validateFields()

  // 提交表单
  const sumbit = useDebounce(async () => {
    setUpDateLoading(true)
    await validateForm()
    const values = baseForm.current.formFn()?.getFieldsValue()
    const res = await setCustomerBigImageSetApi(Number(shopId), {
      ...detail,
      show: values.show,
      pcImgList: values.pcImgList ? (Array.isArray(values.pcImgList) ? values.pcImgList : [values.pcImgList]).map((item: MediaItem) => getImgUploadModelValue(item)) : [],
      wapImgList: values.wapImgList ? (Array.isArray(values.wapImgList) ? values.wapImgList : [values.wapImgList]).map((item: MediaItem) => getImgUploadModelValue(item)) : [],
    })
    if (res.success) {
      successMessage(res.message || '保存成功')
      // initModuleData(res.data as CustomerSetBigImage)
    } else {
      errorMessage(res.message || '保存失败，请稍后再试！')
    }
    setUpDateLoading(false)
  }, 300)

  return <>
    <Spin spinning={getDataLoading || upDateLoading}>
      <BaseForm ref={ref => baseForm.current = ref!} moduleID={moduleID} formItems={formItems}></BaseForm>
      <Button
        className={`${styles['submit-btn']}`}
        loading={upDateLoading}
        disabled={upDateLoading}
        type="primary"
        onClick={sumbit}
      >保存</Button>
    </Spin>
  </>
}

export default BigImage
