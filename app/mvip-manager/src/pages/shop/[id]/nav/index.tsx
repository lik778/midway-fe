import React, { useState, useEffect } from 'react';
import ShopNav from '@/components/shop-nav';
import ShopBasisTab from '@/components/shop-basis-tab';
import { ShopBasisType } from '@/enums';
import './index.less'
export default (props: any) => {
  return (
      <div>
        <ShopBasisTab type={ShopBasisType.NAV}/>
       <div className="container">
          <ShopNav/>
       </div>
      </div>
    );
}


