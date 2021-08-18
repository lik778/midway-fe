import React, { FC, useState, useEffect, forwardRef, Ref, useRef, useImperativeHandle } from 'react';
import { useParams } from 'umi';
import { Spin, FormInstance } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { cloneDeepWith } from 'lodash';
import { swiperProductForm } from './config'
import { Detail } from './data'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { ModuleProductSwiper, ModulePageType, ModuleComponentId, } from '@/interfaces/shop'
import { getModuleInfoApi, setModuleBannerInfoApi } from '@/api/shop'
import styles from './index.less'
import SelectItem from '../../../../../components/select-item'

import { mockData } from '@/utils';
import { errorMessage, successMessage } from '@/components/message';
import { SelectProductListItem } from '../../../../../components/select-item/data';
interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId
  setSwiperType: (swiperType: 'swiper' | 'product') => void
}

const Product = (props: Props, parentRef: Ref<any>) => {
  const params = useParams<{ id: string }>()
  const { setSwiperType, position, pageModule } = props
  const [detail, setDetail] = useState<Detail>({
    backGroundImg: '',
    productList: [],
  })
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  const formRef = useRef<{ form: FormInstance | undefined }>({ form: undefined })

  const [config, setConfig] = useState<FormConfig>(() => {
    const config = cloneDeepWith(swiperProductForm)
    config.customerFormItemList = [{
      index: 2,
      key: 'productList',
      node: <SelectItem key='productList' configKey='homePage-banner'></SelectItem>
    }]
    return config
  });

  // 获取模块的数据  判断当前用户是用产品轮播还是什么
  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await getModuleInfoApi<ModuleProductSwiper>(Number(params.id), {
      position, pageModule
    })
    setDetail({
      backGroundImg: res.data.backGroundImg,
      productList: res.data.productList
    })
    setSwiperType(res.data.bannerProduct ? 'product' : 'swiper')
    setGetDataLoading(false)
  }

  useEffect(() => {
    getDetail()
  }, [])

  const handleSubmit = async () => {
    await formRef.current.form?.validateFields()
    const values = formRef.current.form?.getFieldsValue()
    setUpDataLoading(true)
    const res = await setModuleBannerInfoApi(Number(params.id), {
      bannerProduct: true,
      ...values,
      productIdList: values.productList.map((item: SelectProductListItem) => item.id),
      position, pageModule
    })
    if (res.success) {
      successMessage(res.message)
    } else {
      errorMessage(res.message)
      return null
    }
    setUpDataLoading(false)
  }

  useImperativeHandle(parentRef, () => ({
    handleUpData: handleSubmit,
    disabled: upDataLoading
  }))

  return <div className={styles["product-container"]}>
    <Spin spinning={getDataLoading || upDataLoading}>
      <WildcatForm
        ref={formRef}
        editDataSource={detail}
        config={config}
      />
    </Spin>
  </div>
}

export default forwardRef(Product)