import React, { FC, useEffect, useMemo, useState } from 'react'
import { useParams } from 'umi';
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import { ShopBasisType } from '@/enums'
import { ModulePageType, ModuleComponentId } from '@/interfaces/shop'
import { getModuleInitInfoApi } from '@/api/shop'
import { PageItemOption, MenuItemOption } from './data'
import SelectPage from './components/select-page'
import Menu from './components/menu'
import Content from './components/content'
import styles from './index.less'
import { mockData } from '@/utils';


const ModuleManagement = () => {
  const params = useParams<{ id: string }>()
  const [moduleOptions, setModuleOptions] = useState<any[]>([])
  const [position, setPosition] = useState<ModulePageType>()
  const [pageModule, setComponentId] = useState<ModuleComponentId>()

  // 页面选择器配置
  const [pageOptions, setPageOptions] = useState<PageItemOption[]>([])

  // 组件选择器 key keyof ModulePageType 类型定义会报错
  const [menuOptions, setMenuOptions] = useState<{
    [key in ModulePageType]: MenuItemOption[]
  }>({} as any)

  const getComponentInit = async () => {
    const res = await getModuleInitInfoApi(Number(params.id))
    setModuleOptions(res.data)
  }

  const initPageOptions = () => {
    setPageOptions(moduleOptions.map(item => ({
      key: item.position,
      label: item.name
    })))
  }

  const initMenuOptions = () => {
    const menuOptions: {
      [key in ModulePageType]: MenuItemOption[]
    } = {} as any
    moduleOptions.forEach(item => {
      menuOptions[item.position as ModulePageType] = item.infoList.map((cItem: any) => ({
        id: cItem.pageModule,
        name: cItem.name,
        thumbnail: cItem.name,
        max: cItem.max
      }))
    })
    setMenuOptions(menuOptions)
  }

  const initComponent = () => {
    initPageOptions()
    initMenuOptions()
    setPosition(moduleOptions.length > 0 ? moduleOptions[0].position : 'homePage')
    setComponentId(moduleOptions.length > 0 && moduleOptions[0].infoList && moduleOptions[0].infoList.length > 0 ? moduleOptions[0].infoList[0].pageModule : 'banner')
    // setPosition('productListPage')
    // setComponentId('productRecommend')
    // setComponentId('articleRecommend')
  }

  // 切换页面的时候 将左侧组件选择恢复到第一个
  useEffect(() => {
    if (menuOptions[position as ModulePageType]) {
      setComponentId(menuOptions[position as ModulePageType][0].id)
    }
  }, [position])

  // 获得数据后初始化组件数据
  useEffect(() => {
    initComponent()
  }, [moduleOptions])

  // 获取组件信息
  useEffect(() => {
    getComponentInit()
  }, [])

  // 更新左侧名称
  const handleChangeModuleName = (name: string) => {
    const componentConfig = menuOptions[position!].find(item => item.id === pageModule)
    componentConfig!.name = name
    setMenuOptions({ ...menuOptions })
  }

  return <>
    <BasisHeader type={ShopBasisType.MODULE} />
    <div className={`${styles['module-management-container']} container`}>
      <div className={styles['module-management-content']}>
        {
          position && <SelectPage pageOptions={pageOptions} handleChangePosition={setPosition} position={position}></SelectPage>
        }
        {
          position && pageModule && <div className={styles['line']}>
            <div className={styles['menu']}>
              <Menu position={position} pageModule={pageModule} menuOptions={menuOptions} handleChangeComponent={setComponentId}></Menu>
            </div>
            <div className={styles['content']}>
              <Content position={position} pageModule={pageModule} handleChangeModuleName={handleChangeModuleName}></Content>
            </div>
          </div>
        }
      </div>
    </div>
  </>
}

export default ModuleManagement
