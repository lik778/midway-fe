import React, { useEffect } from 'react';
import { Cascader } from 'antd';
import { getAreasApi } from '@/api/user';

const options = [
  {
    value: 'sichuan',
    label: '四川',
    children: [
      {
        value: 'chendu',
        label: '成都',
      },
    ],
  }];

export default (props: any) => {
  // useEffect(() => {
  //   (async() => {
  //     const res = await getAreasApi('m0');
  //     if (res.success) { console.log(res.data) }
  //   })()
  // }, [])

  const formatArea = () => {
    console.log('更新数据')
  }

  return (<Cascader size='large' options={options} />)
}
