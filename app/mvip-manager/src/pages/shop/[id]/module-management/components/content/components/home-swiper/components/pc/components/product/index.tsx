import React, { FC, useState, useEffect, forwardRef, Ref, useRef, useImperativeHandle } from 'react';
import { Button, Row, Col, FormInstance } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { cloneDeepWith } from 'lodash';
import { swiperProductForm } from './config'
import { Detail } from './data'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import styles from './index.less'
import SelectItem from '../../../../../components/select-item'
import { ConfigKey } from '../../../../../components/select-item/data'

import { mockData } from '@/utils';
interface Props {
  setSwiperType: (swiperType: 'swiper' | 'product') => void
}

const Product = (props: Props, parentRef: Ref<any>) => {
  const { setSwiperType } = props
  const [detail, setDetail] = useState<Detail>({
    backGroundImg: '',
    productList: [],
  })
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
    const res = await mockData<any>('data', {
      "backGroundImg": "http://img6.baixing.net/eea2df034c49dbd09a7d0079dde980e4.jpg_sv1",
      "productList": [
        {
          "id": 2075,
          "name": "dfas",
          "price": "面议",
          "headImg": "http://img5.baixing.net/dc03a3ea825652047f4cc43e420e46dc.png_sv1",
          "urlSuffix": "http://shop.baixing.cn/dfjasidfjjs/p-2120.html"
        },
        {
          "id": 2070,
          "name": "抗日游行1",
          "price": "面议",
          "headImg": "http://img6.baixing.net/5b9c77aac2d80436484c7935ccfd000a.png_sv1",
          "urlSuffix": "http://shop.baixing.cn/version/p-2124.html"
        }
      ],
      "bannerProduct": true
    })
    setDetail({
      backGroundImg: res.data.backGroundImg,
      productList: res.data.productList
    })
    setSwiperType(res.data.bannerProduct ? 'product' : 'swiper')
  }

  useEffect(() => {
    getDetail()
  }, [])

  const handleSubmit = async () => {

    await formRef.current.form?.validateFields()
    setUpDataLoading(true)
    const res = await mockData('data', null)
    setUpDataLoading(false)
  }

  useImperativeHandle(parentRef, () => ({
    handleUpData: handleSubmit,
    disabled: upDataLoading
  }))

  return <div className={styles["product-container"]}>
    <WildcatForm
      ref={formRef}
      editDataSource={detail}
      config={config}
    />
  </div>
}

export default forwardRef(Product)