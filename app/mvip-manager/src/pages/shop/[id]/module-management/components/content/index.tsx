import React, { FC, useState, useEffect } from 'react';
import { PageType, ComponentId } from '../../data'
import styles from './index.less'
import CacheComponent from '@/components/cache-component'
import HomeAboutUs from './components/home-about-us'
import CustomModule from './components/home-custom'
import HomeSwiper from './components/home-swiper'
import SelectItemList from './components/select-item-list'
import HomeCustom from './components/home-custom'

interface Props {
  position: PageType,
  pageModule: ComponentId
  handleChangeModuleName: (componentName: string) => void
}

const Content: FC<Props> = (props) => {
  const { position, pageModule, handleChangeModuleName } = props
  return <>
    <CacheComponent visible={position === 'homePage' && pageModule === 'banner'}>
      <HomeSwiper></HomeSwiper>
    </CacheComponent>
    <CacheComponent visible={position === 'homePage' && pageModule === 'productRecommend'}>
      <SelectItemList position='homePage' pageModule='productRecommend' type='product' configKey="homePage-productRecommend"></SelectItemList>
    </CacheComponent>
    <CacheComponent visible={position === 'homePage' && pageModule === 'autoConfig'}>
      <HomeCustom></HomeCustom>
    </CacheComponent>
    <CacheComponent visible={position === 'homePage' && pageModule === 'about'}>
      <HomeAboutUs></HomeAboutUs>
    </CacheComponent>
    <CacheComponent visible={position === 'articleInfoPage' && pageModule === 'banner'}>
      swiper
    </CacheComponent>



    <CacheComponent visible={position === 'productListPage' && pageModule === 'articleRecommend'}>
      <SelectItemList position='productListPage' pageModule='articleRecommend' type='article' configKey="productListPage-articleRecommend"></SelectItemList>
    </CacheComponent>
  </>
}

export default Content
