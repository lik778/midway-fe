import React from 'react';
import { postApi, getApi } from '@/api/base';

export default () => {
  // api request demo
  postApi('/management/api', { method: 'post', path: '/api/midway/backend/shop/listing',
    params: JSON.stringify({ page: 1, size: 2 })
  }).then(res => {
    console.log(res)
  })

  // 获取又拍云
  getApi('/haojing/upyunImgConfig').then(res => {
    console.log(res)
  })
  return (
    <div>
      <h1>主页</h1>
    </div>
  );
}
