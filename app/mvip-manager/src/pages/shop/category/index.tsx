import ShopModule from '@/components/shop-module';
import React from 'react';
import { ShopModuleType } from '@/enums';

export default (props: any) => {
  return (<ShopModule  {...props} type={ShopModuleType.category}/>)
}
