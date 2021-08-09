import React, { FC, useState, useEffect } from 'react';
import { PageType, ComponentId } from '../../data'
import styles from './index.less'
import CacheComponent from '@/components/cache-component'
import HomeAboutUs from './components/home-about-us'
import AboutAboutUs from './components/about-about-us'
import HomeSwiper from './components/home-swiper'
import SelectItemList from './components/select-item-list'
import HomeCustom from './components/home-custom'
import ArticleInfoSwiper from './components/article-info-swiper'

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

    <CacheComponent visible={position === 'productListPage' && pageModule === 'productRecommend'}>
      <SelectItemList position='productListPage' pageModule='productRecommend' type='product' configKey="productListPage-productRecommend"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'productListPage' && pageModule === 'articleRecommend'}>
      <SelectItemList position='productListPage' pageModule='articleRecommend' type='article' configKey="productListPage-articleRecommend"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'articleListPage' && pageModule === 'productRecommend'}>
      <SelectItemList position='articleListPage' pageModule='productRecommend' type='product' configKey="articleListPage-productRecommend"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'articleInfoPage' && pageModule === 'banner'}>
      <ArticleInfoSwiper></ArticleInfoSwiper>
    </CacheComponent>

    <CacheComponent visible={position === 'articleInfoPage' && pageModule === 'productRecommend'}>
      <SelectItemList position='articleInfoPage' pageModule='productRecommend' type='product' configKey="articleInfoPage-productRecommend"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'articleInfoPage' && pageModule === 'articleRecommend'}>
      <SelectItemList position='articleInfoPage' pageModule='articleRecommend' type='article' configKey="articleInfoPage-articleRecommend"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'aboutPage' && pageModule === 'about'}>
      <AboutAboutUs></AboutAboutUs>
    </CacheComponent>
  </>
}

export default Content
