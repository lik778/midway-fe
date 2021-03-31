import React from 'react'
import { connect } from 'dva'


const PathAuth = (props: any) => {
  const { route: { path: urlPath } } = props
  // todo 给每个页面做路由限制
  return <div>{ props.children }</div>
}

export default connect()(PathAuth)
