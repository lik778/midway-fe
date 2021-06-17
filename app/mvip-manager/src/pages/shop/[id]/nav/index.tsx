import React from 'react'
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import ShopNav from './components/shop-nav'
import { ShopBasisType } from '@/enums'
import './index.less'

const ShopNavPage = (props: any) => {
  return (
    <>
      <BasisHeader {...props} type={ShopBasisType.NAV} />
      <div className="container">
        <ShopNav />
      </div>
    </>
  );
}

ShopNavPage.wrappers = ['@/wrappers/path-auth']

export default ShopNavPage

