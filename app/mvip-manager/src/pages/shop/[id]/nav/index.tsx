import React, { useState, useEffect } from 'react';
import ShopNav from '@/components/shop-nav';
import BasisHeader from '@/components/basis-header';
import { ShopBasisType } from '@/enums';
import './index.less'

export default (props: any) => {
  return (
      <div>
        <BasisHeader type={ShopBasisType.NAV}/>
       <div className="container">
          <ShopNav/>
       </div>
      </div>
    );
}


