
import React, {useEffect, useState} from 'react';
import ShopBasisTab from '@/components/shop-basis-tab';
import MainTitle from '@/components/main-title';
import { getShopInfoApi } from '@/api/shop';
import { ShopBasisType } from '@/enums';
import { useParams, Link } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';
import './index.less';

interface Props {
  type: ShopBasisType;
}

export default (props: Props) => {
  const { type } = props
  const [title, setTitle] = useState('')
  const [shopUrl, setShopUrl] = useState('')
  // 获取店铺id
  const params: RouteParams = useParams();
  const shopId = Number(params.id);
  useEffect(() => {
    (async () => {
      const res =  await getShopInfoApi(shopId)
      if (res?.success) {
        setTitle(res?.data?.name)
        setShopUrl(res?.data?.shopDomain)
      } else {
        errorMessage(res?.message)
      }
     })()
  }, []);
  return (
    <div className="basis-header">
      { title && <Link className="arrow" to="/shop"></Link> }
      { title && <MainTitle title={title}/> }
      { title && <a className="visit-online"href={shopUrl} target="_blank">访问线上</a> }
      <ShopBasisTab type={type}/>
    </div>
  );
}
