import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AiModuleContext from '../../context'
import { ModuleKey } from '../..//data'
import Loading from '@/components/loading'
import { Redirect, useHistory } from 'umi';


const AuthPage: FC = (props) => {
  const history = useHistory()
  const { children } = props
  const { auth } = useContext(AiModuleContext)
  if (auth) {
    switch (history.location.pathname) {
      case '/ai-module/promote-create':
        return <>{children}</>
      case '/ai-module/promote-create/ai-list':
        if (auth?.postTool || auth?.shop || auth?.zhidao) {
          return <>{children}</>
        }
        break;
      case '/ai-module/promote-create/post-create':
      case '/ai-module/promote-create/post-title-create':
        if (auth?.postTool) {
          return <>{children}</>
        }
        break
      case '/ai-module/promote-create/shop-create':
        if (auth?.shop) {
          return <>{children}</>
        }
        break
      case '/ai-module/promote-create/zhidao-basic-material':
      case '/ai-module/promote-create/zhidao-create':
      case '/ai-module/promote-create/zhidao-detail':
        if (auth?.zhidao) {
          return <>{children}</>
        }
        break
    }
  } else {
    return <Loading></Loading>
  }
  return <Redirect to="/no-auth" />
}

export default AuthPage