import React  from 'react'
import { connect } from 'dva'
import { isNull } from 'lodash'
import { baseMapStateToProps } from '@/models/base'
import { Redirect } from 'umi'


const PathAuth = (props: any) => {
  const { route: { path: urlPath }, menuAuthList } = props

  if (isNull(menuAuthList)) return <></>

  if (menuAuthList.some((x: string) => urlPath.includes(x))) {
    return <div>{ props.children }</div>
  }

  return <Redirect to="/no-auth" />
}

export default connect(baseMapStateToProps)(PathAuth)
