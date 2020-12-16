
import React, {useEffect, useState} from 'react';
import ShopBasisTab from '@/components/shop-basis-tab';
import MainTitle from '@/components/main-title';
import { getShopInfoApi } from '@/api/shop';
import { ShopBasisType } from '@/enums';
import { useParams } from 'umi';
import {message} from "antd"
import { RouteParams } from '@/interfaces/shop';
interface basisHeader{
  type: ShopBasisType;
}

export default (props: basisHeader) => {
  const {type} = props
  const [title, setTitle] = useState('')
  // 获取店铺id
  const params: RouteParams = useParams();
  const [paramId, setParamId] = useState(Number(params.id))
  useEffect(() => {
    (async () => {
      const res =  await getShopInfoApi(paramId)
      if (res?.success) {
        setTitle(res?.data?.name)
      } else {
        message.error(res?.message)
      }
     })()
  }, [paramId]);
  return (
    <div className="basis-header">
      <MainTitle title={title}/>
      <ShopBasisTab type={type}/>
    </div>
  );
}
