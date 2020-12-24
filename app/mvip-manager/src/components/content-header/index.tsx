import React, {useEffect, useState} from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import { getShopInfoApi } from '@/api/shop';
import { ShopModuleType, ProductType } from '@/enums';
import { useParams } from 'umi';
import {message} from "antd"
import { RouteParams } from '@/interfaces/shop';
interface contentHeader{
  type: ShopModuleType;
  onChangeType(type:ProductType):void;
}

export default (props: contentHeader) => {
  const {type, onChangeType} = props
  const [title, setTitle] = useState('')
  // 获取店铺id
  const params: RouteParams = useParams();
  const [paramId, setParamId] = useState(Number(params.id))
  useEffect(() => {
    (async () => {
      const res =  await getShopInfoApi(paramId)
      if (res?.success) {
        setTitle(res?.data?.name)
        onChangeType(res?.data?.type)
      } else {
        message.error(res?.message)
      }
     })()
  }, [paramId]);
  return (
    <div className="content-header">
      <MainTitle title={title}/>
      <ShopModuleTab type={type}/>
    </div>
  );
}
