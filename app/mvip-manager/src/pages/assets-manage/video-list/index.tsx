import React from 'react'

import ImageListPage from '../image-list/index'
import NavBar from './page-nav/index'

// 资源管理 - 视频列表
const AssetsMangeVideoListPage = () => {
  return <ImageListPage
    directoryType="VIDEO"
    defaultScope={{ item: null, type: 'album', label: '分组', countLabel: '个' }}
    navBar={NavBar}
    key="video-list"
  />
}

AssetsMangeVideoListPage.wrappers = ['@/wrappers/path-auth']

export default AssetsMangeVideoListPage
