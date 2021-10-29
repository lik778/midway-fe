import React, { useState, FC, useEffect, useRef, useCallback } from 'react';
import { AiModuleContextProps, ModuleKey } from './data'
import AiModuleContext, { defaultValue as defaultContextValue } from './context'
import { useDebounce } from '@/hooks/debounce';
import { getAiModuleTabList, getUserVipResources } from '@/api/ai-module'
import { useHistory } from 'umi'
import AuthPage from './components/auth'
import { InitCollectionForm, UserVipResourcesListItem, AuthKey } from '@/interfaces/ai-module'


const AiModule: FC = (props) => {
  const history = useHistory()
  const [auth, setAuth] = useState<{
    [key in ModuleKey]: boolean
  } | null>(null)
  const [activeModuleKey, setActiveModuleKey] = useState<ModuleKey>('postTool')
  const [copyId, setCopyId] = useState<number | null>(null)
  const [copyIdType, setCopyIdType] = useState<ModuleKey | null>(null)
  const [pageInfo, setPageInfo] = useState<{
    [key in ModuleKey]: {
      page: number,
      dataTotal: number
    }
  }>({
    postTool: {
      page: 1,
      dataTotal: 0,
    },
    shop: {
      page: 1,
      dataTotal: 0,
    },
    zhidao: {
      page: 1,
      dataTotal: 0,
    },
  })

  // 发帖通 数据相关
  const [postToolFormDisabled, setPostToolFormDisabled] = useState<boolean>(false)
  const [postToolFormData, setPostToolFormData] = useState<{
    [key: string]: InitCollectionForm
  }>({})
  const [vipResourcesList, setVipResourcesList] = useState<UserVipResourcesListItem[]>([])
  const [selectedVipResources, setSelectedVipResources] = useState<UserVipResourcesListItem | null>(null)

  const handleChangeContextData = <T extends keyof AiModuleContextProps>(key: T, data: AiModuleContextProps[T]) => {
    switch (key) {
      case 'auth':
        setAuth(data as AiModuleContextProps['auth'])
        break;
      case 'activeModuleKey':
        setActiveModuleKey(data as AiModuleContextProps['activeModuleKey'])
        break;
      case 'copyId':
        setCopyId(data as AiModuleContextProps['copyId'])
        break;
      case 'copyIdType':
        setCopyIdType(data as AiModuleContextProps['copyIdType'])
        break;
      case 'pageInfo':
        setPageInfo(data as AiModuleContextProps['pageInfo'])
        break;
      case 'postToolFormDisabled':
        setPostToolFormDisabled(data as AiModuleContextProps['postToolFormDisabled'])
        break;
      case 'postToolFormData':
        setPostToolFormData(data as AiModuleContextProps['postToolFormData'])
        break;
      case 'vipResourcesList':
        setVipResourcesList(data as AiModuleContextProps['vipResourcesList'])
        break;
      case 'selectedVipResources':
        setSelectedVipResources(data as AiModuleContextProps['selectedVipResources'])
        break;
    }
  }

  const getUserVipResourcesFn = async () => {
    const res = await getUserVipResources()
    if (res.success) {
      handleChangeContextData('vipResourcesList', res.data)
      handleChangeContextData('selectedVipResources', res.data[0])
    }
  }

  const getAiModuleTabListFn = async () => {
    const res = await getAiModuleTabList()
    const auth: { [key in ModuleKey]: boolean } = {
      postTool: false,
      shop: false,
      zhidao: false
    }
    if (res.success) {
      if (res.data.length === 0) {
        history.replace('/no-auth')
      }
      let activeModuleKey: ModuleKey = 'postTool'
      if (res.data.includes('POSTTOOL')) {
        auth.postTool = true
      }
      if (res.data.includes('ZHIDAO')) {
        auth.zhidao = true
      }
      if (res.data.includes('SHOP')) {
        auth.shop = true
      }
      if (auth.postTool) {
        activeModuleKey = 'postTool'
      } else if (auth.zhidao) {
        activeModuleKey = 'zhidao'
      } else if (auth.shop) {
        activeModuleKey = 'shop'
      }
      handleChangeContextData('auth', auth)
      handleChangeContextData('activeModuleKey', activeModuleKey)
    }
    return auth
  }

  // 获取基础信息是否填写状态
  const initPage = async () => {
    // Promise.all([getAiModuleTabListFn(), getUserVipResourcesFn(), getShopStatus()])
    const auth = await getAiModuleTabListFn()
    if (auth.postTool) {
      await getUserVipResourcesFn()
    }
  }

  useEffect(() => {
    initPage()
  }, [])

  return <AiModuleContext.Provider value={{
    auth,
    activeModuleKey,
    copyId,
    copyIdType,
    pageInfo,
    postToolFormDisabled,
    postToolFormData,
    vipResourcesList,
    selectedVipResources,
    handleChangeContextData
  }}>
    <AuthPage>
      {props.children}
    </AuthPage>
  </AiModuleContext.Provider>
}

export default AiModule