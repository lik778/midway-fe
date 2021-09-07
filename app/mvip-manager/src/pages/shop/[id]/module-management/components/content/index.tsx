import React, { FC, useMemo, useEffect } from 'react';
import { SHOP_NAMESPACE } from '@/models/shop';
import { ShopInfo, ModulePageType, ModuleComponentId } from '@/interfaces/shop'
import { ProductType } from '@/enums';
import styles from './index.less'
import CacheComponent from '@/components/cache-component'
import HomeAboutUs from './components/home-about-us'
import AboutAboutUs from './components/about-about-us'
import HomeSwiper from './components/home-swiper'
import SelectItemList from './components/select-item-list'
import HomeCustom from './components/home-custom'
import ArticleInfoSwiper from './components/article-info-swiper'

interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId
  handleChangeModuleName: (componentName: string) => void,
  curShopInfo: ShopInfo | null;
}

const Content: FC<Props> = (props) => {
  const { position, pageModule, handleChangeModuleName, curShopInfo } = props
  
  const isB2B = useMemo(() => {
    if (curShopInfo) {
      const { type } = curShopInfo;
      return Boolean(type === ProductType.B2B)
    }
    return true
  }, [curShopInfo])

  return <>
    <CacheComponent visible={position === 'homePage' && pageModule === 'banner'}>
      <HomeSwiper position={position} pageModule={pageModule}></HomeSwiper>
    </CacheComponent>

    <CacheComponent visible={position === 'homePage' && pageModule === 'productRecommend'}>
      <SelectItemList position='homePage' pageModule='productRecommend' type='product' configKey="homePage-productRecommend"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'homePage' && pageModule === 'autoConfig'}>
      <HomeCustom></HomeCustom>
    </CacheComponent>

    <CacheComponent visible={position === 'homePage' && pageModule === 'articleList'}>
      <SelectItemList position='homePage' pageModule='articleList' type='article' configKey="homePage-articleList"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'homePage' && pageModule === 'about'}>
      <HomeAboutUs position={position} pageModule={pageModule}></HomeAboutUs>
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
      <ArticleInfoSwiper position={position} pageModule={pageModule}></ArticleInfoSwiper>
    </CacheComponent>

    <CacheComponent visible={position === 'articleInfoPage' && pageModule === 'productRecommend'}>
      <SelectItemList position='articleInfoPage' pageModule='productRecommend' type='product' configKey="articleInfoPage-productRecommend"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'articleInfoPage' && pageModule === 'articleRecommend'}>
      <SelectItemList position='articleInfoPage' pageModule='articleRecommend' type='article' configKey="articleInfoPage-articleRecommend"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'productInfoPage' && pageModule === 'productRecommend'}>
      <SelectItemList position='productInfoPage' pageModule='productRecommend' type='product' configKey="productInfoPage-productRecommend"></SelectItemList>
    </CacheComponent>

    <CacheComponent visible={position === 'aboutPage' && pageModule === 'about'}>
      <AboutAboutUs position={position} pageModule={pageModule}></AboutAboutUs>
    </CacheComponent>
  </>
}

export default Content
