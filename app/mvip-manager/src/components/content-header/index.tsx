import React, {useEffect, useState} from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import { getShopInfoApi } from '@/api/shop';
import { ShopModuleType, ProductType } from '@/enums';
import { Link, useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';
interface contentHeader{
  type: ShopModuleType;
  onChangeType(type:ProductType):void;
}

export default (props: contentHeader) => {
  const {type, onChangeType} = props
  const [title, setTitle] = useState('')
  const [shopUrl, setShopUrl] = useState('')
  const [tabType, setTabType] = useState('')
  // 获取店铺id
  const params: RouteParams = useParams();
  const [paramId, setParamId] = useState(Number(params.id))
  useEffect(() => {
    (async () => {
      const res =  await getShopInfoApi(paramId)
      if (res?.success) {
        setTitle(res?.data?.name)
        setShopUrl(res?.data?.shopDomain)
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
      { title && <Link className="arrow" to="/shop"></Link> }
      { title && <MainTitle title={title}/> }
      { title && <a className="visit-online"href={shopUrl} target="_blank">访问线上</a>}
      <ShopModuleTab type={type} tabType={tabType}/>
    </div>
  );
}
