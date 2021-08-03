import React, { FC, useState, useEffect } from 'react';
import { Button, Radio, RadioChangeEvent, Form } from 'antd'
import { Detail } from './data'
import styles from './index.less'
import CatchComponent from '@/components/cache-component'
import SwiperComponent from './components/swiper'
import ProductComponent from './components/product'

const PcSwiper: FC = () => {
  const [swiperType, setSwiperType] = useState<'swiper' | 'product'>('swiper')

  const handleChangeSwiperType = (e: RadioChangeEvent) => {
    setSwiperType(e.target.value)
  }
  return <div className={styles['pc-container']}>
    <Form.Item label={'电脑端'}>
      <Radio.Group name="radiogroup" value={swiperType} onChange={handleChangeSwiperType}>
        <Radio value={'swiper'}>轮播图</Radio>
        <Radio value={'product'}>轮播产品</Radio>
      </Radio.Group>
      <CatchComponent visible={swiperType === 'swiper'}>
        <SwiperComponent></SwiperComponent>
      </CatchComponent>
      <CatchComponent visible={swiperType === 'product'}>
        <ProductComponent></ProductComponent>
      </CatchComponent>
    </Form.Item>
  </div>
}

export default PcSwiper