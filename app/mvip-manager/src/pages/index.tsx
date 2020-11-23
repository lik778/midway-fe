import React from 'react';
import axios from 'axios';

export default () => {
  axios.interceptors.response.use(res => {
    return Promise.resolve(res)
  }, err => {
    console.log(err.response.data)
  })
  axios.post('/management/api', {
    method: 'post', path: '/api/midway/backend/shop/listing',
    params: JSON.stringify({ page: 1, size: 2 })
  }).then(res => {
    console.log(res)
  })

  return (
    <div>
      <h1>主页</h1>
    </div>
  );
}
