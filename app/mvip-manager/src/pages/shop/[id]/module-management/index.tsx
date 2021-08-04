import React, { FC, useEffect, useMemo, useState } from 'react'
import { useParams } from 'umi';
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import { ShopBasisType } from '@/enums'
import { PageType, ComponentId, MenuItemConfig } from './data'
import SelectPage from './components/select-page'
import Menu from './components/menu'
import Content from './components/content'
import styles from './index.less'

const ModuleManagement = () => {
  const [page, setPage] = useState<PageType>('home')
  const [componentId, setComponentId] = useState<ComponentId>('aboutUs')

  // 页面选择器配置
  const [pageOptions] = useState<{
    key: PageType,
    label: string
  }[]>([{
    key: 'home',
    label: '首页'
  }, {
    key: 'article-detail',
    label: '文章详情页'
  }])

  useEffect(() => {
    // 切换页面的时候 将左侧组件选择恢复到第一个
    setComponentId(menuConfig[page as PageType][2].id)
  }, [page])

  // 组件选择器 key keyof PageType 类型定义会报错
  const [menuConfig, setMenuConfig] = useState<{
    [key: string]: MenuItemConfig[]
  }>({
    'home': [{
      id: 'swiper',
      name: '轮播图/产品',
      thumbnail: '//file.baixing.net/201709/4916aa54f4b4c69b4c01591fe6a87046.png'
    }, {
      id: 'hotProduct',
      name: '热门产品',
      thumbnail: '//file.baixing.net/201709/4916aa54f4b4c69b4c01591fe6a87046.png'
    }, {
      id: 'customer',
      name: '自定义模块',
      thumbnail: '//file.baixing.net/201709/4916aa54f4b4c69b4c01591fe6a87046.png'
    }, {
      id: 'aboutUs',
      name: '关于我们',
      thumbnail: '//file.baixing.net/201709/4916aa54f4b4c69b4c01591fe6a87046.png'
    }],
    'article-detail': [{
      id: 'swiper',
      name: '轮播图',
      thumbnail: '//file.baixing.net/201709/4916aa54f4b4c69b4c01591fe6a87046.png'
    }]
  })

  // 更新左侧名称
  const handleChangeModuleName = (name: string) => {
    const componentConfig = menuConfig[page].find(item => item.id === componentId)
    componentConfig!.name = name
    setMenuConfig({ ...menuConfig })
  }

  return <>
    <BasisHeader type={ShopBasisType.MODULE} />
    <div className={`${styles['module-management-container']} container`}>
      <div className={styles['module-management-content']}>
        <SelectPage pageOptions={pageOptions} handleChangePage={setPage} page={page}></SelectPage>
        <div className={styles['line']}>
          <div className={styles['menu']}>
            <Menu page={page} componentId={componentId} menuConfig={menuConfig} handleChangeComponent={setComponentId}></Menu>
          </div>
          <div className={styles['content']}>
            <Content page={page} componentId={componentId} handleChangeModuleName={handleChangeModuleName}></Content>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default ModuleManagement
