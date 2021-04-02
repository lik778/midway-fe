import React from 'react'
import { UnlockTwoTone } from '@ant-design/icons'
import './index.less'

export default () => {
  return <div className="container">
    <div className="no-auth-text">
      <UnlockTwoTone style={{ marginRight: 10 }} />
      没有页面访问权限</div>
  </div>
}
