import React from 'react'
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import ShopNav from './components/shop-nav'
import { ShopBasisType } from '@/enums'
import './index.less'

export default (props: any) => {
  return (
      <div>
       <BasisHeader {...props} type={ShopBasisType.NAV}/>
       <div className="container">
          <ShopNav/>
       </div>
      </div>
    );
}


