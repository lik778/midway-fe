import React, {useEffect, useState} from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import { getShopInfoApi } from '@/api/shop';
import { ShopModuleType } from '@/enums';
import { useParams } from 'umi';
import {message} from "antd"
import { RouteParams } from '@/interfaces/shop';
interface contentHeader{
  type: ShopModuleType;
}

export default (props: contentHeader) => {
  const {type} = props
  const [title, setTitle] = useState('')
  // 获取店铺id
  const params: RouteParams = useParams();
  useEffect(() => {
    (async () => {
      const res =  await getShopInfoApi(Number(params.id))
      if (res?.success) {
        setTitle(res?.data?.name)
      } else {
        message.error(res?.message)
      }
     })()
  }, []);
  return (
    <div className="content-header">
      <MainTitle title={title}/>
      <ShopModuleTab type={type}/>
    </div>
  );
}
