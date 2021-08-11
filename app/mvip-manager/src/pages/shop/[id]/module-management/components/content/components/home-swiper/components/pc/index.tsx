import React, { FC, useState, Ref, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useParams } from 'umi';
import { Button, Radio, RadioChangeEvent, Form } from 'antd'
import { ShopInfo } from '@/interfaces/shop';
import { Detail } from './data'
import styles from './index.less'
import CatchComponent from '@/components/cache-component'
import SwiperComponent from './components/swiper'
import { setModuleBannerInfoApi } from '@/api/shop'
import { ModulePageType, ModuleComponentId, } from '@/interfaces/shop'
import ProductComponent from './components/product'
import { mockData } from '@/utils';
import { ProductType } from '@/enums';

interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId
  curShopInfo: ShopInfo
}

const PcSwiper = (props: Props, parentRef: Ref<any>) => {
  const params = useParams<{ id: string }>()
  const { curShopInfo, position, pageModule } = props
  const [swiperType, setSwiperType] = useState<'swiper' | 'product'>(curShopInfo.type === ProductType.B2B ? 'product' : 'swiper')

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


  // 这里写disabledFc是因为当前组件更新一次以后没有再更新（ref不触发页面更新），所以swiperRef.current.disabled || productRef.current.disabled是第一次刷新组件的值，写出函数，swiperRef.current.disabled是对子组件ref的引用，所以能获取到最新值
  useImperativeHandle(parentRef, () => ({
    handleUpData: handleUpData,
    disabledFc: () => swiperRef.current.disabled || productRef.current.disabled,
  }), [swiperType])

  // 保存轮播图需要单独再打个接口
  const handleSubmitNoProduct = async () => {
    const res = await setModuleBannerInfoApi(Number(params.id), {
      bannerProduct: false,
      position, pageModule
    })
  }

  const handleUpData = () => {
    if (swiperType === 'product') {
      productRef.current.handleUpData()
    } else {
      Promise.all([handleSubmitNoProduct(), swiperRef.current.handleUpData('all')])
    }
  }

  const handleChangeSwiperType = (e: RadioChangeEvent) => {
    setSwiperType(e.target.value)
  }

  return <div className={styles['pc-container']}>
    <Form.Item className={styles['radio-group-item']} label={'电脑端'}>
      <Radio.Group name="radiogroup" value={swiperType} onChange={handleChangeSwiperType}>
        <Radio value={'swiper'}>轮播图</Radio>
        {
          curShopInfo.type === ProductType.B2B && <Radio value={'product'}>轮播产品</Radio>
        }
      </Radio.Group>
    </Form.Item>
    {
      swiperType && <>
        <CatchComponent visible={swiperType === 'swiper'}>
          <SwiperComponent ref={swiperRef} position={position} pageModule={pageModule}></SwiperComponent>
        </CatchComponent>
        <CatchComponent visible={swiperType === 'product'}>
          <ProductComponent ref={productRef} setSwiperType={setSwiperType} position={position} pageModule={pageModule}></ProductComponent>
        </CatchComponent>
      </>
    }
  </div>
}

export default forwardRef(PcSwiper)