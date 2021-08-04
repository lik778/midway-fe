import React, { FC, useState, Ref, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Radio, RadioChangeEvent, Form } from 'antd'
import { ShopInfo } from '@/interfaces/shop';
import { Detail } from './data'
import styles from './index.less'
import CatchComponent from '@/components/cache-component'
import SwiperComponent from './components/swiper'
import ProductComponent from './components/product'

interface Props {
  curShopInfo: ShopInfo
}

const PcSwiper = (props: Props, parentRef: Ref<any>) => {
  const { curShopInfo } = props
  const [swiperType, setSwiperType] = useState<'swiper' | 'product'>('product')


  const swiperRef = useRef<{
    handleUpData: (type: 'all') => Promise<void>,
    disabled: boolean
  }>({
    handleUpData: async () => { },
    disabled: false
  })

  const productRef = useRef<{
    handleUpData: () => Promise<void>,
    disabled: boolean
  }>({
    handleUpData: async () => { },
    disabled: false
  })

  useImperativeHandle(parentRef, () => ({
    handleUpData: handleUpData,
    disabled: swiperRef.current.disabled
  }))

  const handleUpData = () => {
    if (swiperType === 'product') {
      productRef.current.handleUpData()
    } else {
      swiperRef.current.handleUpData('all')
    }
  }

  const handleChangeSwiperType = (e: RadioChangeEvent) => {
    setSwiperType(e.target.value)
  }

  return <div className={styles['pc-container']}>
    <Form.Item className={styles['radio-group-item']} label={'电脑端'}>
      <Radio.Group name="radiogroup" value={swiperType} onChange={handleChangeSwiperType}>
        <Radio value={'swiper'}>轮播图</Radio>
        <Radio value={'product'}>轮播产品</Radio>
      </Radio.Group>
    </Form.Item>
    <CatchComponent visible={swiperType === 'swiper'}>
      <SwiperComponent ref={swiperRef}></SwiperComponent>
    </CatchComponent>
    <CatchComponent visible={swiperType === 'product'}>
      <ProductComponent ref={productRef}></ProductComponent>
    </CatchComponent>
  </div>
}

export default forwardRef(PcSwiper)