import React, { FC, useContext, useEffect } from 'react';
import { Redirect } from 'umi';

// 上线后修改主站跳转链接
const AiContent = () => {
  return <Redirect to={'/ai-module/promote-create/zhidao-create'}> </Redirect>
}

export default AiContent

