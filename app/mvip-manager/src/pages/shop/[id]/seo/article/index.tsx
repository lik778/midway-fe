import React from 'react';
import { ShopTDKType, ShopTDKPosition } from '@/enums';
import SeoPage from '../components/page';

export default () => {
  return <SeoPage pagePosition={ShopTDKPosition.ARTICLE} pageType={ShopTDKType.ARTICLE}></SeoPage>
}
