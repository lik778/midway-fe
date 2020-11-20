import React from 'react';
import axios from 'axios';

export default () => {
  axios.post('/management/api').then(res => {
    console.log(res)
  }).catch(e => e)

  return (
    <div>
      <h1>主页</h1>
    </div>
  );
}
