import React from 'react';
import { ShopModuleType } from '@/enums';

interface Props {
  type: ShopModuleType;
}

export default (props: Props) => {
  if (props.type === ShopModuleType.PRODUCT) {
    return (
        <div>类目: 没有数据</div>
    )
  } else if (props.type === ShopModuleType.ARTICLE) {
    return (
        <div>文章: 没有数据</div>
    )
  } else {
    return ( <div>没有这个类型</div>)
  }
}
