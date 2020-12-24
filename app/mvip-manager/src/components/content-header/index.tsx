import React, {useEffect, useState} from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import { getShopInfoApi } from '@/api/shop';
import { ShopModuleType, ProductType } from '@/enums';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';
interface contentHeader{
  type: ShopModuleType;
  onChangeType(type:ProductType):void;
}

export default (props: contentHeader) => {
  const {type, onChangeType} = props
  const [title, setTitle] = useState('')
  const [tabType, setTabType] = useState('')
  // 获取店铺id
  const params: RouteParams = useParams();
  const [paramId, setParamId] = useState(Number(params.id))
  useEffect(() => {
    (async () => {
      const res =  await getShopInfoApi(paramId)
      if (res?.success) {
        setTitle(res?.data?.name)
        onChangeType(res?.data?.type)
        if(res?.data?.type === ProductType.B2B){
          setTabType('产品')
        }else{
          setTabType('服务')
        }    
      } else {
        errorMessage(res?.message)
      }
     })()
  }, [paramId]);
  return (
    <div className="content-header">
      <MainTitle title={title}/>
      <ShopModuleTab type={type} tabType={tabType}/>
    </div>
  );
}
