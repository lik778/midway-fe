import React, { FC, useState, useEffect } from 'react';
import { PageType, ComponentId } from '../../data'
import styles from './index.less'
import CacheComponent from '@/components/cache-component'
import HomeAboutUs from './components/home-about-us'
import CustomModule from './components/home-custom'
import HomeSwiper from './components/home-swiper'

interface Props {
  page: PageType,
  componentId: ComponentId
  handleChangeModuleName: (componentName: string) => void
}

const Content: FC<Props> = (props) => {
  const { page, componentId, handleChangeModuleName } = props
  return <>
    <CacheComponent visible={page === 'home' && componentId === 'swiper'}>
      <HomeSwiper></HomeSwiper>
    </CacheComponent>
    <CacheComponent visible={page === 'home' && componentId === 'hotProduct'}>
      hotProduct
    </CacheComponent>
    <CacheComponent visible={page === 'home' && componentId === 'customer'}>
      <CustomModule />
    </CacheComponent>
    <CacheComponent visible={page === 'home' && componentId === 'aboutUs'}>
      <HomeAboutUs></HomeAboutUs>
    </CacheComponent>
    <CacheComponent visible={page === 'article-detail' && componentId === 'swiper'}>
      swiper
    </CacheComponent>
  </>
}

export default Content
