import React, { useState } from 'react';
import ShopNav from '@/components/shop-nav';
import ShopBasisTab from '@/components/shop-basis-tab';
import { ShopBasisType } from '@/enums';
export default (props: any) => {
  const [current, setCurrent] = useState('nav')
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  return (
      <div>
        <ShopBasisTab type={ShopBasisType.SEO}/>
       <div className="container">
       </div>
      </div>
    );
}


