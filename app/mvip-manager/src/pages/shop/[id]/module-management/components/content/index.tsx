import React, { FC, useState, useEffect } from 'react';
import { PageType, ComponentId } from '../../data'
import styles from './index.less'
import CacheComponent from '@/components/cache-component'
import AboutUs from './components/about-us'
interface Props {
  page: PageType,
  componentId: ComponentId
  handleChangeModuleName: (componentName: string) => void
}

const Content: FC<Props> = (props) => {
  const { page, componentId, handleChangeModuleName } = props
  return <>
    <CacheComponent visible={page === 'home' && componentId === 'swiper'}>
      <AboutUs></AboutUs>
    </CacheComponent>
    <CacheComponent visible={page === 'home' && componentId === 'hotProduct'}>
      hotProduct
    </CacheComponent>
    <CacheComponent visible={page === 'home' && componentId === 'customer'}>
      customer
    </CacheComponent>
    <CacheComponent visible={page === 'home' && componentId === 'aboutUs'}>
      <AboutUs></AboutUs>
    </CacheComponent>
    <CacheComponent visible={page === 'article-detail' && componentId === 'swiper'}>
      swiper
    </CacheComponent>
  </>
}

export default Content