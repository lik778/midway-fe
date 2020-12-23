import React, {useEffect, useState} from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import { getShopInfoApi } from '@/api/shop';
import { ShopModuleType } from '@/enums';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';
interface contentHeader{
  type: ShopModuleType;
}

export default (props: contentHeader) => {
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
        errorMessage(res?.message)
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
