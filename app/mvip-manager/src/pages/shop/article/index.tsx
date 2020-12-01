import React from 'react';
import ShopModule from '@/components/shop-module'
import { ShopModuleType } from '@/enums';

export default (props: any) => {
  return (<ShopModule  {...props} type={ShopModuleType.article} />)
}


