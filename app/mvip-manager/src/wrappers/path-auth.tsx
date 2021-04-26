import React  from 'react'
import { Skeleton } from 'antd'
import { connect } from 'dva'
import { isNull } from 'lodash'
import { baseMapStateToProps } from '@/models/base'
import { Redirect } from 'umi'
import MainTitle from '@/components/main-title'


const PathAuth = (props: any) => {
  const { route: { path: urlPath }, menuAuthList } = props

  if (isNull(menuAuthList)) return <>
    <MainTitle title="加载中..."/>
    <div className="container"><Skeleton active paragraph={{ rows: 12 }} /></div>
  </>

  if (menuAuthList.some((x: string) => urlPath.includes(x))) {
    return <div>{ props.children }</div>
  }

  return <Redirect to="/no-auth" />
}

export default connect(baseMapStateToProps)(PathAuth)
